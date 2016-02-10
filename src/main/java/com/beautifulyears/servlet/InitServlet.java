package com.beautifulyears.servlet;

import javax.servlet.http.HttpServlet;

import com.beautifulyears.config.ByWebAppInitializer;
import com.beautifulyears.util.Util;

public class InitServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String host = "http://localhost";
	private String contextPath = "/ROOT";
	private String productServerHost = "localhost";
	private String productServerPort = "8080";
	private String mailSupported = "";
	private String imageUploadPath = "c:/uploads";
	private String sitemapPath = "c:/sitemap";
	private String s3MediaBucketName = "by-dev-media";

	public void init() {
		System.out.println("initializing servlet ==================");

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("host"))) {
			host = ByWebAppInitializer.servletContext.getInitParameter("host");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("sitemapPath"))) {
			sitemapPath = ByWebAppInitializer.servletContext
					.getInitParameter("sitemapPath");
		}

		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("contextPath"))) {
			contextPath = ByWebAppInitializer.servletContext
					.getInitParameter("contextPath");
			if ("/".equals(contextPath)) {
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
		
		if (!Util.isEmpty(ByWebAppInitializer.servletContext
				.getInitParameter("s3MediaBucketName"))) {
			imageUploadPath = ByWebAppInitializer.servletContext
					.getInitParameter("s3MediaBucketName");
		}

		
		System.setProperty("path", host + contextPath);
		System.setProperty("s3MediaBucketName", s3MediaBucketName);
		System.setProperty("productServerHost", productServerHost);
		System.setProperty("productServerPort", productServerPort);
		System.setProperty("mailSupported", mailSupported);
		System.setProperty("imageUploadPath", imageUploadPath);
		System.setProperty("sitemapPath", sitemapPath);

		System.out.println(System.getProperty("path") + ","
				+ System.getProperty("productServerHost") + ","
				+ System.getProperty("productServerPort") + ","
				+ System.getProperty("mailSupported") + ","
				+ System.getProperty("sitemapPath") + ","
				+ System.getProperty("s3MediaBucketName") + ","
				+ System.getProperty("imageUploadPath"));

	}

}