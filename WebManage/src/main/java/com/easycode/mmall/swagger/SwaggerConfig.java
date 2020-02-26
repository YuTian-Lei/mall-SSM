package com.easycode.mmall.swagger;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
//RestApiConfig
@EnableSwagger2 //使swagger2生效
@ComponentScan(basePackages = {"com.easycode,mmall.controller"}) //需要扫描的controller包路径
@Configurable //配置注解，自动在本类上下文加载一些环境变量信息
public class SwaggerConfig extends WebMvcConfigurationSupport {

  @Bean
  public Docket buildDocket(){
    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .select()
        .apis(RequestHandlerSelectors.basePackage("com.easycode.mmall.controller"))//controller路径
        .paths(PathSelectors.any())
        .build();
  }

  private ApiInfo apiInfo() {
    return new ApiInfoBuilder()
        .title("swagger-bootstrap-ui RESTful APIs")
        .description("swagger-bootstrap-ui")
        .termsOfServiceUrl("http://localhost:8999/")
        .contact("developer@mail.com")
        .version("1.0")
        .build();
  }
}
