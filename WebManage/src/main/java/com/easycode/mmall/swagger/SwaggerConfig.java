package com.easycode.mmall.swagger;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
//RestApiConfig
@EnableSwagger2 //使swagger2生效
@Configurable //配置注解，自动在本类上下文加载一些环境变量信息
public class SwaggerConfig extends WebMvcConfigurationSupport {


  // 定义分隔符
  private static final String splitor = ";";


  /**
   * 创建API应用
   * api() 增加API相关信息
   * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
   * 本例采用指定扫描的包路径来定义指定要建立API的目录。
   *
   * @return
   */
  @Bean
  public Docket buildDocket(){
    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .select()
        .apis(basePackage("com.easycode.mmall.controller" + splitor + "com.easycode.mmall.manageController"))
        .paths(PathSelectors.any())
        .build();
  }


  /**
   * 构建 api文档的详细信息函数
   *
   * @return
   */
  private ApiInfo apiInfo() {
    return new ApiInfoBuilder()
        .title("swagger-bootstrap-ui RESTful APIs")
        .description("swagger-bootstrap-ui")
        .termsOfServiceUrl("http://localhost:8999/")
        .version("1.0")
        .build();
  }

  public static Predicate<RequestHandler> basePackage(final String basePackage) {
    return input -> declaringClass(input).transform(handlerPackage(basePackage)).or(true);
  }

  private static Function<Class<?>, Boolean> handlerPackage(final String basePackage)     {
    return input -> {
      // 循环判断匹配
      for (String strPackage : basePackage.split(splitor)) {
        boolean isMatch = input.getPackage().getName().startsWith(strPackage);
        if (isMatch) {
          return true;
        }
      }
      return false;
    };
  }

  private static Optional<? extends Class<?>> declaringClass(RequestHandler input) {
    return Optional.fromNullable(input.declaringClass());
  }
}
