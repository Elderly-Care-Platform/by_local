package com.beautifulyears.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.beautifulyears.rest.ShortUrlController;

public class Surl extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void init() {
		System.out.println("SURL loaded-------------------------------------");
	}

	protected HttpServletRequest req;
	protected HttpServletResponse resp;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String urlId = req.getParameter("q");
		String url = ShortUrlController.getUrl(urlId);
		resp.sendRedirect(resp.encodeRedirectURL(url));
		
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.req = req;
		this.resp = resp;

	}

}