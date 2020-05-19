package com.easycode.mmall.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.dao.CartMapper;
import com.easycode.mmall.dao.ProductMapper;
import com.easycode.mmall.utils.BigDecimalUtil;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.CartProductVo;
import com.easycode.mmall.vo.CartVo;
import com.easycode.mmall.model.Cart;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.service.CartService;
import com.easycode.mmall.utils.DozerUtil;
import com.easycode.mmall.utils.PropertiesUtil;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import java.math.BigDecimal;
import java.util.List;
import org.dozer.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class CartServiceImpl extends AbstractService<Cart> implements CartService {
    @Resource
    private CartMapper cartMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private Mapper mapper;

    @Override
    public Result<CartVo> add(Integer userId,Integer productId,Integer count){
        if(productId == null || count == null){
            return ResultGenerator.genFailResult("参数不合法", ResultCode.ILLEGAL_ARGUMENT);
        }
        Product product = productMapper.selectByPrimaryKey(productId);
        if(product != null){
            return ResultGenerator.genFailResult("不存在此产品无法添加");
        }
        Example example = new Example(Cart.class);
        example.createCriteria()
            .andEqualTo("userId",userId)
            .andEqualTo("productId",productId);
        List<Cart> cartList = cartMapper.selectByExample(example);
        if(CollectionUtil.isEmpty(cartList)){
            //这个产品不在这个购物车里,需要新增一个产品记录
            Cart  cartItem = new Cart();
            cartItem.setQuantity(count);
            cartItem.setChecked(CONST.Cart.CHECKED);
            cartItem.setProductId(productId);
            cartItem.setUserId(userId);
            cartMapper.insert(cartItem);
        }else {
            //产品已经在购物车里了
            Cart cart = cartList.get(0);
            count = cart.getQuantity() + count;
            cart.setQuantity(count);
            cartMapper.updateByPrimaryKeySelective(cart);
        }
        CartVo cartVo = this.getCartVoLimit(userId);
        return ResultGenerator.genSuccessResult(cartVo);
    }

    @Override
    public Result<CartVo> update(Integer userId,Integer productId,Integer count){
        if(productId == null || count == null){
            return ResultGenerator.genFailResult("参数不合法", ResultCode.ILLEGAL_ARGUMENT);
        }
        Example example = new Example(Cart.class);
        example.createCriteria()
            .andEqualTo("userId",userId)
            .andEqualTo("productId",productId);
        List<Cart> cartList = cartMapper.selectByExample(example);
        if(CollectionUtil.isNotEmpty(cartList)){
            Cart cart = cartList.get(0);
            cart.setQuantity(count);
            cartMapper.updateByPrimaryKeySelective(cart);
        }
        CartVo cartVo = this.getCartVoLimit(userId);
        return  ResultGenerator.genSuccessResult(cartVo);
    }

    @Override
    public Result<CartVo> deleteProduct(Integer userId,String productIds){
        List<String> productList = Splitter.on(",").splitToList(productIds);
        if(CollectionUtil.isEmpty(productList)){
            return ResultGenerator.genFailResult("参数不合法", ResultCode.ILLEGAL_ARGUMENT);
        }
        cartMapper.deleteByUserIdProductIds(userId,productList);
        CartVo cartVo = this.getCartVoLimit(userId);
        return  ResultGenerator.genSuccessResult(cartVo);
    }
    @Override
    public Result<CartVo> list (Integer userId){
        CartVo cartVo = this.getCartVoLimit(userId);
        return  ResultGenerator.genSuccessResult(cartVo);
    }

    @Override
    public Result<CartVo> selectOrUnSelect (Integer userId,Integer productId,Integer checked){
        cartMapper.checkedOrUncheckedProduct(userId,productId,checked);
        return  this.list(userId);
    }

    @Override
    public Result<Integer> getCartProductCount(Integer userId){
        if(userId == null){
            return ResultGenerator.genSuccessResult(0);
        }
        return ResultGenerator.genSuccessResult(cartMapper.selectCartProductCount(userId));
    }



    private CartVo getCartVoLimit(Integer userId){
        CartVo cartVo = new CartVo();
        Example example = new Example(Cart.class);
        example.createCriteria().andEqualTo("userId",userId);
        List<Cart> cartList = cartMapper.selectByExample(example);
        List<CartProductVo> cartProductVoList = Lists.newArrayList();

        BigDecimal cartTotalPrice = new BigDecimal("0");
        if(CollectionUtil.isNotEmpty(cartList)){
            for(Cart cartItem : cartList) {
                CartProductVo cartProductVo = DozerUtil.map(mapper, cartItem, CartProductVo.class);

                Product product = productMapper.selectByPrimaryKey(cartItem.getProductId());
                if (product != null) {
                    cartProductVo.setProductMainImage(product.getMainImage());
                    cartProductVo.setProductName(product.getName());
                    cartProductVo.setProductSubtitle(product.getSubtitle());
                    cartProductVo.setProductStatus(product.getStatus());
                    cartProductVo.setProductPrice(product.getPrice());
                    cartProductVo.setProductStock(product.getStock());
                    //判断库存
                    int buyLimitCount = 0;
                    if (product.getStock() >= cartItem.getQuantity()) {
                        buyLimitCount = cartItem.getQuantity();
                        cartProductVo.setLimitQuantity(CONST.Cart.LIMIT_NUM_SUCCESS);
                    } else {
                        buyLimitCount = product.getStock();
                        cartProductVo.setLimitQuantity(CONST.Cart.LIMIT_NUM_FAIL);
                        //在购物车中更新有效库存
                        Cart cartForQuantity = new Cart();
                        cartForQuantity.setId(cartItem.getId());
                        cartForQuantity.setQuantity(buyLimitCount);
                        cartMapper.updateByPrimaryKeySelective(cartForQuantity);
                    }
                    cartProductVo.setQuantity(buyLimitCount);
                    //计算总价
                    cartProductVo.setProductTotalPrive(
                        BigDecimalUtil.mul(product.getPrice().doubleValue(),
                            cartProductVo.getQuantity().doubleValue()));
                    cartProductVo.setProductChecked(cartItem.getChecked());
                }
                if (cartItem.getChecked() == CONST.Cart.CHECKED) {
                    cartTotalPrice = BigDecimalUtil.add(cartTotalPrice.doubleValue(), cartProductVo.getProductTotalPrive().doubleValue());
                }
                cartProductVoList.add(cartProductVo);
            }
        }
        cartVo.setCartTotalPrice(cartTotalPrice);
        cartVo.setCartProductVoList(cartProductVoList);
        cartVo.setAllChecked(this.getAllCheckedStatus(userId));
        cartVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix"));
        return cartVo;
    }

    private  boolean getAllCheckedStatus(Integer userId){
        if(userId == null){
            return false;
        }
        Example example = new Example(Cart.class);
        example.createCriteria().andEqualTo("checked",0).andEqualTo("userId",userId);
        return cartMapper.selectCountByExample(example) == 0;
    }


}
