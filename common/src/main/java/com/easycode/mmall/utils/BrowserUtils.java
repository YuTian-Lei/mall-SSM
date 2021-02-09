package com.easycode.mmall.utils;

public class BrowserUtils {

  public static String getBrowserName(String agent) {
    agent = agent.toLowerCase();
    if (agent.indexOf("msie 7") > 0) {
      return "ie7";
    } else if (agent.indexOf("msie 8") > 0) {
      return "ie8";
    } else if (agent.indexOf("msie 9") > 0) {
      return "ie9";
    } else if (agent.indexOf("msie 10") > 0) {
      return "ie10";
    } else if (agent.indexOf("msie") > 0) {
      return "ie";
    } else if (agent.indexOf("opera") > 0) {
      return "opera";
    } else if (agent.indexOf("opera") > 0) {
      return "opera";
    } else if (agent.indexOf("firefox") > 0) {
      return "firefox";
    } else if (agent.indexOf("gecko") > 0 && agent.indexOf("rv:11") > 0) {
      return "ie11";
    } else if (agent.contains("edge")) {
      return "ie edge";
    } else if (agent.indexOf("chrome") > 0) {
      return "chrome";
    } else {
      return "others";
    }
  }

  public static String getBrowserNames(String agent) {
    agent = agent.toLowerCase();
    if (agent.indexOf("msie 7") > 0) {
      return "ie7";
    } else if (agent.indexOf("msie 8") > 0) {
      return "ie8";
    } else if (agent.indexOf("msie 9") > 0) {
      return "ie9";
    } else if (agent.indexOf("msie 10") > 0) {
      return "ie10";
    } else if (agent.indexOf("msie") > 0) {
      return "ie";
    } else if (agent.indexOf("opera") > 0) {
      return "opera";
    } else if (agent.indexOf("opera") > 0) {
      return "opera";
    } else if (agent.indexOf("firefox") > 0) {
      return "firefox";
    } else if (agent.indexOf("gecko") > 0 && agent.indexOf("rv:11") > 0) {
      return "ie11";
    } else if (agent.contains("edge")) {
      return "ie edge";
    } else if (agent.indexOf("chrome") > 0) {
      return "chrome";
    } else {
      return "others";
    }
  }
}
