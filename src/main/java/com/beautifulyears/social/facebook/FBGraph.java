package com.beautifulyears.social.facebook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

public class FBGraph {
	private static final Logger logger = Logger.getLogger(FBGraph.class);
	private String accessToken;

	public FBGraph(String accessToken) {
		this.accessToken = accessToken;
	}
	
	public String getFBGraph() {
		String graph = null;
		try {

			String g = "https://graph.facebook.com/me?fields=email,id,gender,name&" + accessToken;
			logger.debug(g);
			URL u = new URL(g);
			URLConnection c = u.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					c.getInputStream()));
			String inputLine;
			StringBuffer b = new StringBuffer();
			while ((inputLine = in.readLine()) != null)
				b.append(inputLine + "\n");
			in.close();
			graph = b.toString();
			logger.debug(graph);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("ERROR in getting FB graph data. " + e);
		}
		return graph;
	}

	public Map<String, String> getGraphData(String fbGraph) throws IOException {
		Map<String, String> fbProfile = new HashMap<String, String>();
		try {
			JSONObject json = new JSONObject(fbGraph);
			fbProfile.put("displayName", json.getString("name"));
			fbProfile.put("id", json.getString("id"));
			fbProfile.put("email", json.getString("email"));
			fbProfile.put("gender", json.getString("gender"));
		} catch (JSONException e) {
			e.printStackTrace();
			throw new RuntimeException("ERROR in parsing FB graph data. " + e);
		}
		return fbProfile;
	}
}