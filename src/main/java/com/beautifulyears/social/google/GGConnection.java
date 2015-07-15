package com.beautifulyears.social.google;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import org.json.JSONObject;

public class GGConnection {
	public static final String GG_APP_ID = "52899981762-d1khoej7o879atddpcm8sh6639eck4sm.apps.googleusercontent.com";
	public static final String GG_APP_SECRET = "hInqyMi-mo35OVgx0BROwftu";
	public static final String REDIRECT_URI = "http://localhost:8080/by/api/v1/users/ggRes";

	static String accessToken = "";

	public String getGGAuthUrl() {
		String ggLoginUrl = "";
		try {
			ggLoginUrl = "https://accounts.google.com/o/oauth2/auth?" + "client_id="
					+ URLEncoder.encode(GGConnection.GG_APP_ID, "UTF-8") 
					+ "&redirect_uri="
					+ URLEncoder.encode(GGConnection.REDIRECT_URI, "UTF-8")
					+ "&response_type=code"
					+ "&scope=email%20profile";
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();	
		}
		return ggLoginUrl;
	}

	public String getAccessToken(String code) throws IOException {
		StringBuffer rawData = new StringBuffer("");
		rawData.append("code="+code);
		rawData.append("&");
		rawData.append("client_id="+GG_APP_ID);
		rawData.append("&");
		rawData.append("client_secret="+GG_APP_SECRET);
		rawData.append("&");
		rawData.append("redirect_uri="+REDIRECT_URI);
		rawData.append("&");
		rawData.append("grant_type=authorization_code");



		
		String type = "application/x-www-form-urlencoded";
		String encodedData = rawData.toString(); 
		URL u = new URL("https://www.googleapis.com/oauth2/v3/token");
		HttpURLConnection conn = (HttpURLConnection) u.openConnection();
		conn.setDoOutput(true);
		conn.setRequestMethod("POST");
		conn.setRequestProperty( "Content-Type", type );
		conn.setRequestProperty( "Content-Length", String.valueOf(encodedData.length()));
		OutputStream os = conn.getOutputStream();
		os.write(encodedData.getBytes());
		BufferedReader in = new BufferedReader(new InputStreamReader(
				conn.getInputStream()));
		String inputLine;
		StringBuffer b = new StringBuffer();
		while ((inputLine = in.readLine()) != null)
			b.append(inputLine + "\n");
		
		JSONObject json = new JSONObject(b.toString());
		String accessToken = json.getString("access_token");
		return accessToken;
//		if ("".equals(accessToken)) {
//			URL fbGraphURL;
//			try {
//				fbGraphURL = new URL(getGGraphUrl(code));
//			} catch (MalformedURLException e) {
//				e.printStackTrace();
//				throw new RuntimeException("Invalid code received " + e);
//			}
//			URLConnection fbConnection;
//			StringBuffer b = null;
//			try {
//				fbConnection = fbGraphURL.openConnection();
//				BufferedReader in;
//				in = new BufferedReader(new InputStreamReader(
//						fbConnection.getInputStream()));
//				String inputLine;
//				b = new StringBuffer();
//				while ((inputLine = in.readLine()) != null)
//					b.append(inputLine + "\n");
//				in.close();
//			} catch (IOException e) {
//				e.printStackTrace();
//				throw new RuntimeException("Unable to connect with Google "
//						+ e);
//			}
//
//			accessToken = b.toString();
//			if (accessToken.startsWith("{")) {
//				throw new RuntimeException("ERROR: Access Token Invalid: "
//						+ accessToken);
//			}
//		}
//		return accessToken;
	}
}