package com.easycode.mmall.web.shiro;

import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.EncodeUtils;
import java.util.HashSet;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.AccountException;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
public class CustomRealm extends AuthorizingRealm{

  @Autowired
  private UserService mmallUserService;

  /**
  * 登录验证
  * */
  @Override
  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken autToken) throws AuthenticationException {

    UsernamePasswordToken userPwdToken = (UsernamePasswordToken) autToken;
    String username = userPwdToken.getUsername();

    if (username == null) {
      throw new AccountException("Null usernames are not allowed by this realm.");
    }

    User user = mmallUserService.findBy("username",username);
    if (null == user) {
      throw new UnknownAccountException("No account found for admin [" + username + "]");
    }
    byte[] salt = EncodeUtils.decodeHex(user.getSalt());

    SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user.getUsername(),
        user.getPassword(), getName());
    if (user.getSalt() != null) {
      authenticationInfo.setCredentialsSalt(ByteSource.Util.bytes(salt));
    }
    return authenticationInfo;
  }

  /**
   * 用户授权
   * 此方法调用  hasRole,hasPermission的时候才会进行回调.
   *
   * 权限信息.(授权):
   * 1、如果用户正常退出，缓存自动清空；
   * 2、如果用户非正常退出，缓存自动清空；
   * 3、如果我们修改了用户的权限，而用户不退出系统，修改的权限无法立即生效。
   * （需要手动编程进行实现；放在service进行调用）
   * 在权限修改后调用realm中的方法，realm已经由spring管理，所以从spring中获取realm实例，
   * 调用clearCached方法；
   * :Authorization 是授权访问控制，用于对用户进行的操作授权，证明该用户是否允许进行当前操作，如访问某个链接，某个资源文件等。
   */
  @Override
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) throws AuthenticationException{
    /*
     * 当没有使用缓存的时候，不断刷新页面的话，这个代码会不断执行，
     * 当其实没有必要每次都重新设置权限信息，所以我们需要放到缓存中进行管理；
     * 当放到缓存中时，这样的话，doGetAuthorizationInfo就只会执行一次了，
     * 缓存过期之后会再次执行。
     */
    log.info("后台权限校验-->CustomRealm.doGetAuthorizationInfo()");
    SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
    User user = (User) principals.getPrimaryPrincipal();

    //从数据库中或者缓存中获取角色数据
    Set<String> roles = new HashSet<String>();
    Set<String> stringPermissions = new HashSet<String>();
    roles.add("USER");
    stringPermissions.add("USER:DELETE");//角色:权限

    authorizationInfo.setRoles(roles);//角色可以通过数据库查询得到
    authorizationInfo.setStringPermissions(stringPermissions);//权限可以通过数据库查询得到
    return authorizationInfo;
  }
}
