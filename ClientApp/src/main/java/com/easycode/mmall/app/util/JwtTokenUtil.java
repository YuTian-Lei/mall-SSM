package com.easycode.mmall.app.util;

import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.app.conf.UserLoginException;
import com.easycode.mmall.utils.EncodeUtils;
import com.easycode.mmall.utils.ResultGenerator;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * tokenTool
 */
@Slf4j
public class JwtTokenUtil {

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

    private static final String SECRET = "jwtsecret_glasses";
    private static final String ISS = "leopard";

    // 过期时间是3600秒，既是1个小时
    public static final long EXPIRATION = 3600L;

    // 选择了记住我之后的过期时间为7天
    public static final long EXPIRATION_REMEMBER = 604800L;

    /**
     * 创建token
     * 注：如果是根据可变的唯一值来生成，唯一值变化时，需重新生成token
     */
    public static String createToken(String id, String username, boolean isRememberMe) {
        long expiration = isRememberMe ? EXPIRATION_REMEMBER : EXPIRATION;
        String encryId = EncodeUtils.encodeBase64(id.getBytes());
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .setIssuer(ISS)
                .setId(encryId)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .compact();
    }

    public static void delToken(HttpServletRequest servletRequest) {
        try {
            getTokenBody(getToken(servletRequest)).setExpiration(new Date());
        } catch (Exception e) {
            log.debug("token has invalided");
        }
    }

    /**
     * 从token中获取用户名
     */
    public static String getUsername(String token) {
        return getTokenBody(token).getSubject();
    }

    /**
     * 从token中获取ID，同时做解密处理
     */
    public static String getObjectId(String token) {
        try {
            return new String(EncodeUtils.decodeBase64(getTokenBody(token).getId()), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 是否已过期
     *
     * @throws ，只能通过捕获ExpiredJwtException异常
     */
    public static boolean isExpiration(String token) {
        return getTokenBody(token).getExpiration().before(new Date());
    }

    /**
     * 获取token信息，同时也做校验处理
     */
    public static Claims getTokenBody(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException expired) {
            //过期
            throw new UserLoginException(ResultGenerator.genFailResult("token过期", ResultCode.TOKENEXPIRED));
        } catch (SignatureException e) {
            //无效
            throw new UserLoginException(ResultGenerator.genFailResult("无效请求", ResultCode.INVALID));
        } catch (MalformedJwtException malformedJwt) {
            //无效
            throw new UserLoginException(ResultGenerator.genFailResult("无效请求", ResultCode.INVALID));
        }
    }

    public static String getToken(HttpServletRequest request) {
        String tokenHeader = request.getHeader(JwtTokenUtil.TOKEN_HEADER);
        tokenHeader = tokenHeader.replace(JwtTokenUtil.TOKEN_PREFIX, "");
        return tokenHeader;
    }

    public static String getUserId(HttpServletRequest request) {
        String tokenHeader = request.getHeader(JwtTokenUtil.TOKEN_HEADER);
        tokenHeader = tokenHeader.replace(JwtTokenUtil.TOKEN_PREFIX, "");
        return JwtTokenUtil.getObjectId(tokenHeader);
    }

    public static String getUsername(HttpServletRequest request) {
        String tokenHeader = request.getHeader(JwtTokenUtil.TOKEN_HEADER);
        tokenHeader = tokenHeader.replace(JwtTokenUtil.TOKEN_PREFIX, "");
        return JwtTokenUtil.getUsername(tokenHeader);
    }
}