package com.beautifulyears.social.facebook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

public class FBConnection {
	private static final Logger logger = Logger.getLogger(FBConnection.class);
	public static final String FB_APP_ID = "475153235986093";
	public static final String FB_APP_SECRET = "7af74ded3f21370d2452b8a5574e340e";
	public static final String REDIRECT_URI = "/api/v1/users/fbRes";
	private static String redirectURI = "";

	static String accessToken = "";

	public String getFBAuthUrl(HttpServletRequest req) {
		FBConnection.redirectURI = System.getProperty("host")
				+ System.getProperty("apiContextPath")
				+ FBConnection.REDIRECT_URI;
		String fbLoginUrl = "";
		try {
			accessToken = "";
			fbLoginUrl = "http://www.facebook.com/dialog/oauth?" + "client_id="
					+ FBConnection.FB_APP_ID + "&redirect_uri="
					+ URLEncoder.encode(FBConnection.redirectURI, "UTF-8")
					+ "&scope=public_profile,email";
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return fbLoginUrl;
	}

	public String getFBGraphUrl(String code) {
		String fbGraphUrl = "";
		try {
			fbGraphUrl = "https://graph.facebook.com/oauth/access_token?"
					+ "client_id=" + FBConnection.FB_APP_ID + "&redirect_uri="
					+ URLEncoder.encode(FBConnection.redirectURI, "UTF-8")
					+ "&client_secret=" + FB_APP_SECRET + "&code=" + code;
			logger.debug(fbGraphUrl);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return fbGraphUrl;
	}

	public String getAccessToken(String code) {
		if ("".equals(accessToken)) {
			URL fbGraphURL;
			try {
				fbGraphURL = new URL(getFBGraphUrl(code));
				logger.debug(fbGraphURL);
			} catch (MalformedURLException e) {
				e.printStackTrace();
				throw new RuntimeException("Invalid code received " + e);
			}
			URLConnection fbConnection;
			StringBuffer b = null;
			try {
				fbConnection = fbGraphURL.openConnection();
				BufferedReader in;
				in = new BufferedReader(new InputStreamReader(
						fbConnection.getInputStream()));
				String inputLine;
				b = new StringBuffer();
				while ((inputLine = in.readLine()) != null)
					b.append(inputLine + "\n");
				logger.debug(b);
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
				throw new RuntimeException("Unable to connect with Facebook "
						+ e);
			}

			accessToken = b.toString();
			if (accessToken.startsWith("{")) {
				throw new RuntimeException("ERROR: Access Token Invalid: "
						+ accessToken);
			}
		}
		return accessToken;
	}
}