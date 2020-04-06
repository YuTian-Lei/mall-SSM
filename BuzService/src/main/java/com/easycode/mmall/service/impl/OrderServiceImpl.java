package com.easycode.mmall.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import com.alipay.api.AlipayResponse;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.demo.trade.config.Configs;
import com.alipay.demo.trade.model.ExtendParams;
import com.alipay.demo.trade.model.GoodsDetail;
import com.alipay.demo.trade.model.builder.AlipayTradePrecreateRequestBuilder;
import com.alipay.demo.trade.model.result.AlipayF2FPrecreateResult;
import com.alipay.demo.trade.service.AlipayTradeService;
import com.alipay.demo.trade.service.impl.AlipayTradeServiceImpl;
import com.alipay.demo.trade.utils.ZxingUtils;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.dao.CartMapper;
import com.easycode.mmall.dao.OrderItemMapper;
import com.easycode.mmall.dao.OrderMapper;
import com.easycode.mmall.dao.PayInfoMapper;
import com.easycode.mmall.dao.ProductMapper;
import com.easycode.mmall.dao.ShippingMapper;
import com.easycode.mmall.model.Cart;
import com.easycode.mmall.model.Order;
import com.easycode.mmall.model.OrderItem;
import com.easycode.mmall.model.PayInfo;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.model.Shipping;
import com.easycode.mmall.service.OrderItemService;
import com.easycode.mmall.service.OrderService;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.utils.BigDecimalUtil;
import com.easycode.mmall.utils.FTPUtil;
import com.easycode.mmall.utils.PropertiesUtil;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.OrderItemVo;
import com.easycode.mmall.vo.OrderProductVo;
import com.easycode.mmall.vo.OrderVo;
import com.easycode.mmall.vo.ShippingVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.tools.internal.jxc.ap.Const;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTimeUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import tk.mybatis.mapper.entity.Example;

/**
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class OrderServiceImpl extends AbstractService<Order> implements OrderService {
  @Resource
  private OrderMapper orderMapper;

  @Autowired
  private OrderItemMapper orderItemMapper;

  @Autowired
  private PayInfoMapper payInfoMapper;

  @Autowired
  private CartMapper cartMapper;

  @Autowired
  private ProductMapper productMapper;

  @Autowired
  private ShippingMapper shippingMapper;

  @Override
  public Result createOrder(Integer userId, Integer shippingId) {
    //从购物车中获取数据
    Example example = new Example(Cart.class);
    example.createCriteria().andEqualTo("userId", userId).andEqualTo("checked", 1);
    List<Cart> cartList = cartMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(cartList)) {
      return ResultGenerator.genFailResult("购物车未勾选商品");
    }

    //计算这个订单的总价
    Result result = getCartOrderItem(userId, cartList);
    if (result.getCode() != ResultCode.SUCCESS.getCode()) {
      return result;
    }
    List<OrderItem> orderItemList = (List<OrderItem>) result.getData();
    BigDecimal payment = getOrderTotalPrice(orderItemList);

    //生成订单
    Order order = assembleOrder(userId, shippingId, payment);
    if (order == null) {
      return ResultGenerator.genFailResult("生成订单错误");
    }
    if (CollectionUtil.isEmpty(orderItemList)) {
      return ResultGenerator.genFailResult("购物车为空");
    }
    for (OrderItem orderItem : orderItemList) {
      orderItem.setOrderNo(order.getOrderNo());
    }
    //mybatis 批量插入
    orderItemMapper.batchInsert(orderItemList);

    //生成成功，我们要减少产品的库存
    reduceProductStock(orderItemList);
    //清空一下购物车
    cleanCart(cartList);

    //返回给前端数据
    OrderVo orderVo = assembleOrderVo(order, orderItemList);
    return ResultGenerator.genSuccessResult(orderVo);
  }

  @Override
  public Result cancel(Integer userId, Long orderNo) {
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);

    List<Order> orderList = orderMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(orderList)) {
      return ResultGenerator.genFailResult("用户没有该订单");
    }
    Order order = orderList.get(0);
    if (order.getStatus() != CONST.OrderStatusEnum.NO_PAY.getCode()) {
      return ResultGenerator.genFailResult("已付款，无法取消订单");
    }

    Order updateOrder = new Order();
    updateOrder.setId(order.getId());
    updateOrder.setStatus(CONST.OrderStatusEnum.CANCELED.getCode());

    int row = orderMapper.updateByPrimaryKeySelective(updateOrder);
    if (row > 0) {
      return ResultGenerator.genSuccessResult();
    }
    return ResultGenerator.genFailResult();
  }

  @Override
  public Result getOrderCartProduct(Integer userId) {
    OrderProductVo orderProductVo = new OrderProductVo();
    //从购物车获取数据
    Example example = new Example(Cart.class);
    example.createCriteria().andEqualTo("userId", userId).andEqualTo("checked", 1);
    List<Cart> cartList = cartMapper.selectByExample(example);

    Result result = getCartOrderItem(userId, cartList);
    if (result.getCode() != ResultCode.SUCCESS.getCode()) {
      return result;
    }

    List<OrderItem> orderItemList = (List<OrderItem>) result.getData();

    List<OrderItemVo> orderItemVoList = orderItemList.stream().map(orderItem -> {
      OrderItemVo orderItemVo = assembleOrderItemVo(orderItem);
      return orderItemVo;
    }).collect(Collectors.toList());

    BigDecimal payment = new BigDecimal("0");
    for (OrderItem orderItem : orderItemList) {
      payment = BigDecimalUtil.add(payment.doubleValue(), orderItem.getTotalPrice().doubleValue());
    }
    orderProductVo.setProductTotalPrice(payment);
    orderProductVo.setOrderItemVoList(orderItemVoList);
    orderProductVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix"));

    return ResultGenerator.genSuccessResult(orderProductVo);
  }

  @Override
  public Result getOrderDetail(Integer userId, Long orderNo) {
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);

    List<Order> orderList = orderMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(orderList)) {
      return ResultGenerator.genFailResult("没有找到该订单");
    }
    Order order = orderList.get(0);
    Example itemExample = new Example(OrderItem.class);
    itemExample.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);
    List<OrderItem> orderItemList = orderItemMapper.selectByExample(itemExample);

    OrderVo orderVo = assembleOrderVo(order, orderItemList);
    return ResultGenerator.genSuccessResult(orderVo);
  }

  @Override
  public Result<PageInfo> getOrderList(Integer userId, int pageNum, int pageSize) {
    PageHelper.startPage(pageNum, pageSize);
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("userId", userId);
    example.orderBy("createTime").desc();
    List<Order> orderList = orderMapper.selectByExample(example);
    List<OrderVo> orderVoList = assembleOrderVoList(orderList,userId);
    PageInfo pageResult = new PageInfo(orderVoList);
    return ResultGenerator.genSuccessResult(pageResult);
  }

  private List<OrderVo> assembleOrderVoList(List<Order> orderList, Integer userId) {
    List<OrderVo> orderVoList = Lists.newArrayList();
    for (Order order : orderList) {
      List<OrderItem> orderItemList = Lists.newArrayList();
      if (userId == null) {
        //todo 管理员查询，不需要传userId
        Example itemExample = new Example(OrderItem.class);
        itemExample.createCriteria()
            .andEqualTo("orderNo", order.getOrderNo());
        orderItemList = orderItemMapper.selectByExample(itemExample);
      } else {
        Example itemExample = new Example(OrderItem.class);
        itemExample.createCriteria()
            .andEqualTo("orderNo", order.getOrderNo())
            .andEqualTo("userId", userId);
        orderItemList = orderItemMapper.selectByExample(itemExample);
      }
      OrderVo orderVo = assembleOrderVo(order,orderItemList);
      orderVoList.add(orderVo);
    }
    return  orderVoList;
  }

  private OrderVo assembleOrderVo(Order order, List<OrderItem> orderItemList) {
    OrderVo orderVo = new OrderVo();
    orderVo.setOrderNo(order.getOrderNo());
    orderVo.setPayment(order.getPayment());
    orderVo.setPaymentType(order.getPaymentType());
    orderVo.setPaymentTypeDesc(CONST.PaymentTypeEnum.codeOf(order.getPaymentType()).getValue());

    orderVo.setPostage(order.getPostage());
    orderVo.setStatus(order.getStatus());
    orderVo.setStatusDesc(CONST.OrderStatusEnum.codeOf(order.getStatus()).getValue());

    orderVo.setShippingId(order.getShippingId());
    Shipping shipping = shippingMapper.selectByPrimaryKey(order.getShippingId());
    if (shipping != null) {
      orderVo.setReceieverName(shipping.getReceiverName());
      orderVo.setShippingVo(assembleShippingVo(shipping));
    }
    orderVo.setPaymentTime(DateUtil.formatDateTime(order.getPaymentTime()));
    orderVo.setSendTime(DateUtil.formatDateTime(order.getSendTime()));
    orderVo.setEndTime(DateUtil.formatDateTime(order.getEndTime()));
    orderVo.setCreateTime(DateUtil.formatDateTime(order.getCreateTime()));
    orderVo.setCloseTime(DateUtil.formatDateTime(order.getCloseTime()));

    orderVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix"));

    List<OrderItemVo> orderItemVoList = orderItemList.stream().map(orderItem -> {
      OrderItemVo orderItemVo = assembleOrderItemVo(orderItem);
      return orderItemVo;
    }).collect(Collectors.toList());

    orderVo.setOrderItemVoList(orderItemVoList);
    return orderVo;
  }

  private OrderItemVo assembleOrderItemVo(OrderItem orderItem) {
    OrderItemVo orderItemVo = new OrderItemVo();
    BeanUtil.copyProperties(orderItem, orderItemVo);
    orderItemVo.setCreateTime(DateUtil.formatDateTime(orderItem.getCreateTime()));
    return orderItemVo;
  }

  private ShippingVo assembleShippingVo(Shipping shipping) {
    ShippingVo shippingVo = new ShippingVo();
    BeanUtil.copyProperties(shipping, shippingVo);
    return shippingVo;
  }

  private void cleanCart(List<Cart> cartList) {
    for (Cart cart : cartList) {
      cartMapper.deleteByPrimaryKey(cart.getId());
    }
  }

  private void reduceProductStock(List<OrderItem> orderItemList) {
    orderItemList.forEach(orderItem -> {
      Product product = productMapper.selectByPrimaryKey(orderItem.getProductId());
      product.setStock(product.getStock() - orderItem.getQuantity());
      productMapper.updateByPrimaryKeySelective(product);
    });
  }

  private Order assembleOrder(Integer userId, Integer shippingId, BigDecimal payment) {
    Order order = new Order();
    long orderNo = generateOrderNo();
    order.setOrderNo(orderNo);
    order.setStatus(CONST.OrderStatusEnum.NO_PAY.getCode());
    order.setPostage(0);
    order.setPaymentType(CONST.PaymentTypeEnum.ONLINE_PAY.getCode());
    order.setPayment(payment);

    order.setUserId(userId);
    order.setShippingId(shippingId);
    int rowCount = orderMapper.insert(order);
    if (rowCount > 0) {
      return order;
    }
    return null;
  }

  private long generateOrderNo() {
    long currentTime = DateTimeUtils.currentTimeMillis();
    return currentTime + new Random().nextInt(100);
  }

  private BigDecimal getOrderTotalPrice(List<OrderItem> orderItemList) {
    BigDecimal payment = new BigDecimal("0");
    for (OrderItem orderItem : orderItemList) {
      payment = BigDecimalUtil.add(payment.doubleValue(), orderItem.getTotalPrice().doubleValue());
    }
    return payment;
  }

  private Result<List<OrderItem>> getCartOrderItem(Integer userid, List<Cart> cartList) {
    List<OrderItem> orderItemList = Lists.newArrayList();
    if (CollectionUtil.isEmpty(cartList)) {
      return ResultGenerator.genFailResult("购物车为空");
    }
    //校验购物车的数据，包括产品的状态和数量
    for (Cart cartItem : cartList) {
      OrderItem orderItem = new OrderItem();
      Product product = productMapper.selectByPrimaryKey(cartItem.getProductId());
      if (CONST.ProductStatusEnum.ON_SALE.getCode() != product.getStatus()) {
        return ResultGenerator.genFailResult("产品" + product.getName() + "不是在线售卖状态");
      }

      //校验库存
      if (cartItem.getQuantity() > product.getStock()) {
        return ResultGenerator.genFailResult("产品" + product.getName() + "库存不足");
      }

      orderItem.setUserId(userid);
      orderItem.setProductId(product.getId());
      orderItem.setProductName(product.getName());
      orderItem.setProductImage(product.getMainImage());
      orderItem.setCurrentUnitPrice(product.getPrice());
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setTotalPrice(
          BigDecimalUtil.mul(product.getPrice().doubleValue(), cartItem.getQuantity()));
      orderItemList.add(orderItem);
    }
    return ResultGenerator.genSuccessResult(orderItemList);
  }

  @Override
  public Result pay(Long orderNo, Integer userId, String path) {
    Map<String, String> resultMap = Maps.newHashMap();
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);

    List<Order> orderList = orderMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(orderList)) {
      return ResultGenerator.genFailResult("用户没有该订单");
    }
    resultMap.put("orderNo", orderList.get(0).getOrderNo().toString());

    // (必填) 商户网站订单系统中唯一订单号，64个字符以内，只能包含字母、数字、下划线，
    // 需保证商户系统端不能重复，建议通过数据库sequence生成，
    String outTradeNo = orderList.get(0).getOrderNo().toString();

    // (必填) 订单标题，粗略描述用户的支付目的。如“xxx品牌xxx门店当面付扫码消费”
    String subject =
        new StringBuilder().append("happymmall扫码支付,订单号:").append(outTradeNo).toString();

    // (必填) 订单总金额，单位为元，不能超过1亿元
    // 如果同时传入了【打折金额】,【不可打折金额】,【订单总金额】三者,则必须满足如下条件:【订单总金额】=【打折金额】+【不可打折金额】
    String totalAmount = orderList.get(0).getPayment().toString();

    // (可选) 订单不可打折金额，可以配合商家平台配置折扣活动，如果酒水不参与打折，则将对应金额填写至此字段
    // 如果该值未传入,但传入了【订单总金额】,【打折金额】,则该值默认为【订单总金额】-【打折金额】
    String undiscountableAmount = "0";

    // 卖家支付宝账号ID，用于支持一个签约账号下支持打款到不同的收款账号，(打款到sellerId对应的支付宝账号)
    // 如果该字段为空，则默认为与支付宝签约的商户的PID，也就是appid对应的PID
    String sellerId = "";

    // 订单描述，可以对交易或商品进行一个详细地描述，比如填写"购买商品2件共15.00元"
    String body = new StringBuilder().append("订单")
        .append(outTradeNo)
        .append("购买商品共")
        .append(totalAmount)
        .append("元")
        .toString();

    // 商户操作员编号，添加此参数可以为商户操作员做销售统计
    String operatorId = "test_operator_id";

    // (必填) 商户门店编号，通过门店号和商家后台可以配置精准到门店的折扣信息，详询支付宝技术支持
    String storeId = "test_store_id";

    // 业务扩展参数，目前可添加由支付宝分配的系统商编号(通过setSysServiceProviderId方法)，详情请咨询支付宝技术支持
    ExtendParams extendParams = new ExtendParams();
    extendParams.setSysServiceProviderId("2088100200300400500");

    // 支付超时，定义为120分钟
    String timeoutExpress = "120m";

    // 商品明细列表，需填写购买商品详细信息
    // 创建一个商品信息，参数含义分别为商品id（使用国标）、名称、单价（单位为分）、数量，如果需要添加商品类别，详见GoodsDetail
    // 创建好一个商品后添加至商品明细列表
    // 继续创建并添加第一条商品信息，用户购买的产品为“黑人牙刷”，单价为5.00元，购买了两件
    Example itemExample = new Example(OrderItem.class);
    itemExample.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);
    List<OrderItem> orderItemList = orderItemMapper.selectByExample(itemExample);
    List<GoodsDetail> goodsDetailList = orderItemList.stream().map((orderItem) -> {
      GoodsDetail goods =
          GoodsDetail.newInstance(orderItem.getProductId().toString(), orderItem.getProductName(),
              BigDecimalUtil.mul(orderItem.getCurrentUnitPrice().doubleValue(),
                  new Double(100).doubleValue()).longValue(),
              orderItem.getQuantity());
      return goods;
    }).collect(Collectors.toList());

    // 创建扫码支付请求builder，设置请求参数
    AlipayTradePrecreateRequestBuilder builder = new AlipayTradePrecreateRequestBuilder()
        .setSubject(subject).setTotalAmount(totalAmount).setOutTradeNo(outTradeNo)
        .setUndiscountableAmount(undiscountableAmount).setSellerId(sellerId).setBody(body)
        .setOperatorId(operatorId).setStoreId(storeId).setExtendParams(extendParams)
        .setTimeoutExpress(timeoutExpress)
        .setNotifyUrl(
            PropertiesUtil.getProperty("alipay.callback.url"))//支付宝服务器主动通知商户服务器里指定的页面http路径,根据需要设置
        .setGoodsDetailList(goodsDetailList);

    Configs.init("zfbinfo.properties");
    /** 使用Configs提供的默认参数
     *  AlipayTradeService可以使用单例或者为静态成员对象，不需要反复new
     */
    AlipayTradeService tradeService = new AlipayTradeServiceImpl.ClientBuilder().build();

    AlipayF2FPrecreateResult result = tradeService.tradePrecreate(builder);
    switch (result.getTradeStatus()) {
      case SUCCESS:
        log.info("支付宝预下单成功: )");

        AlipayTradePrecreateResponse response = result.getResponse();
        dumpResponse(response);

        File folder = new File(path);
        FileUtil.mkdir(folder);

        // 需要修改为运行机器上的路径
        String qrPath = String.format(path + "/qr-%s.png", response.getOutTradeNo());
        String qrFileName = String.format("qr-%s.png", response.getOutTradeNo());
        ZxingUtils.getQRCodeImge(response.getQrCode(), 256, qrPath);

        File targetFile = new File(path, qrFileName);
        try {
          FTPUtil.uploadFile(Lists.newArrayList(targetFile));
          FileUtil.del(targetFile);
        } catch (IOException e) {
          log.error("上传二维码异常", e);
        }
        log.info("filePath:" + qrPath);

        String qrUrl = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFile.getName();
        resultMap.put("qrUrl", qrUrl);
        return ResultGenerator.genSuccessResult(resultMap);
      case FAILED:
        log.error("支付宝预下单失败!!!");
        return ResultGenerator.genFailResult("支付宝预下单失败!!!");
      case UNKNOWN:
        log.error("系统异常，预下单状态未知!!!");
        return ResultGenerator.genFailResult("系统异常，预下单状态未知!!!");
      default:
        log.error("不支持的交易状态，交易返回异常!!!");
        return ResultGenerator.genFailResult("不支持的交易状态，交易返回异常!!!");
    }
  }

  @Override
  public Result aliCallback(Map<String, String> params) {
    Long orderNo = Long.parseLong(params.get("out_trade_no"));
    String tradeNo = params.get("trade_no");
    String tradeStatus = params.get("trade_status");

    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo);
    List<Order> orders = orderMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(orders)) {
      return ResultGenerator.genFailResult("非本系统订单，回调忽略");
    }
    Order order = orders.get(0);
    if (order.getStatus() >= CONST.OrderStatusEnum.PAID.getCode()) {
      return ResultGenerator.genSuccessResult("支付宝重复调用");
    }
    if (CONST.AlipayCallBack.TRADE_STATUS_TRADE_SUCCESS.equals(tradeStatus)) {
      order.setPaymentTime(DateUtil.parse(params.get("gmt_payment")));
      order.setStatus(CONST.OrderStatusEnum.PAID.getCode());
      orderMapper.updateByPrimaryKeySelective(order);
    }

    PayInfo payInfo = new PayInfo();
    payInfo.setUserId(order.getUserId());
    payInfo.setOrderNo(order.getOrderNo());
    payInfo.setPayPlatform(CONST.PayPlatformEnum.ALIPAY.getCode());
    payInfo.setPlatformNumber(tradeNo);
    payInfo.setPlatformStatus(tradeStatus);

    payInfoMapper.insert(payInfo);
    return ResultGenerator.genSuccessResult();
  }

  @Override
  public Result queryOrderPayStatus(Integer userId, Long orderNo) {
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo).andEqualTo("userId", userId);

    List<Order> orderList = orderMapper.selectByExample(example);
    if (CollectionUtil.isEmpty(orderList)) {
      return ResultGenerator.genFailResult("用户没有该订单");
    }
    Order order = orderList.get(0);
    if (order.getStatus() >= CONST.OrderStatusEnum.PAID.getCode()) {
      return ResultGenerator.genSuccessResult();
    }
    return ResultGenerator.genFailResult();
  }

  // 简单打印应答
  private void dumpResponse(AlipayResponse response) {
    if (response != null) {
      log.info(String.format("code:%s, msg:%s", response.getCode(), response.getMsg()));
      if (StringUtils.isNotEmpty(response.getSubCode())) {
        log.info(String.format("subCode:%s, subMsg:%s", response.getSubCode(),
            response.getSubMsg()));
      }
      log.info("body:" + response.getBody());
    }
  }

  @Override
  public Result manageList(int pageNum,int pageSize){
    PageHelper.startPage(pageNum,pageSize);
    Example example = new Example(Order.class);
    example.orderBy("createTime").desc();
    List<Order> orderList = orderMapper.selectByExample(example);
    List<OrderVo> orderVoList = assembleOrderVoList(orderList,null);
    PageInfo pageResult = new PageInfo(orderList);
    pageResult.setList(orderVoList);
    return ResultGenerator.genSuccessResult(pageResult);
  }

  @Override
  public Result manageDetail(Long orderNo){
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo);

    List<Order> orderList = orderMapper.selectByExample(example);

    if(CollectionUtil.isNotEmpty(orderList)){
      Order order = orderList.get(0);
      Example itemExample = new Example(OrderItem.class);
      itemExample.createCriteria().andEqualTo("orderNo", orderNo);
      List<OrderItem> orderItemList = orderItemMapper.selectByExample(itemExample);
      OrderVo orderVo = assembleOrderVo(order,orderItemList);
      return ResultGenerator.genSuccessResult(orderVo);
    }
    return  ResultGenerator.genFailResult("订单不存在");
  }


  @Override
  public Result<PageInfo> manageSearch(Long orderNo,int pageNum,int pageSize){
    PageHelper.startPage(pageNum,pageSize);
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo);

    List<Order> orderList = orderMapper.selectByExample(example);

    if(CollectionUtil.isNotEmpty(orderList)){
      Order order = orderList.get(0);
      Example itemExample = new Example(OrderItem.class);
      itemExample.createCriteria().andEqualTo("orderNo", orderNo);
      List<OrderItem> orderItemList = orderItemMapper.selectByExample(itemExample);
      OrderVo orderVo = assembleOrderVo(order,orderItemList);
      PageInfo pageResult = new PageInfo(orderList);
      pageResult.setList(Lists.newArrayList(orderVo));
      return ResultGenerator.genSuccessResult(pageResult);
    }
    return  ResultGenerator.genFailResult("订单不存在");
  }


  @Override
  public Result<String> manageSendGoods(Long orderNo){
    Example example = new Example(Order.class);
    example.createCriteria().andEqualTo("orderNo", orderNo);
    List<Order> orderList = orderMapper.selectByExample(example);
    if(CollectionUtil.isNotEmpty(orderList)){
      Order order = orderList.get(0);
      if(order.getStatus() == CONST.OrderStatusEnum.PAID.getCode()){
        order.setStatus(CONST.OrderStatusEnum.SHIPPED.getCode());
        order.setSendTime(new Date());
        orderMapper.updateByPrimaryKeySelective(order);
        return  ResultGenerator.genSuccessResult("发货成功");
      }
    }
    return  ResultGenerator.genFailResult("订单不存在");
  }
}
