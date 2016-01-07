package com.beautifulyears.servlet;

import javax.servlet.http.HttpServlet;

import com.beautifulyears.config.ByWebAppInitializer;
import com.beautifulyears.util.Util;

public class InitServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String host = "localhost:8080";
	private String contextPath = "/ROOT";
	private String productServerHost = "localhost";
	private String productServerPort = "8080";
	private String mailSupported = "";
	private String imageUploadPath = "c:/uploads";

	public void init() {
		System.out.println("initializing servlet ==================");

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("host"))) {
			host = ByWebAppInitializer.servletContext.getInitParameter("host");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("contextPath"))) {
			contextPath = ByWebAppInitializer.servletContext
					.getInitParameter("contextPath");
			if("/".equals(contextPath)){
				contextPath = "";
			}
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("productServerHost"))) {
			productServerHost = ByWebAppInitializer.servletContext
					.getInitParameter("productServerHost");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("productServerPort"))) {
			productServerPort = ByWebAppInitializer.servletContext
					.getInitParameter("productServerPort");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("mail"))) {
			mailSupported = ByWebAppInitializer.servletContext
					.getInitParameter("mail");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("imageUploadPath"))) {
			imageUploadPath = ByWebAppInitializer.servletContext
					.getInitParameter("imageUploadPath");
		}

		System.setProperty("path", host + contextPath);
		System.setProperty("productServerHost", productServerHost);
		System.setProperty("productServerPort", productServerPort);
		System.setProperty("mailSupported", mailSupported);
		System.setProperty("imageUploadPath", imageUploadPath);

		System.out.println(System.getProperty("path") + ","
				+ System.getProperty("productServerHost") + ","
				+ System.getProperty("productServerPort") + ","
				+ System.getProperty("mailSupported") + ","
				+ System.getProperty("imageUploadPath"));

	}

}