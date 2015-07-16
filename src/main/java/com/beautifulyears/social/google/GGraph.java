package com.beautifulyears.social.google;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GGraph {
	private static final Logger logger = Logger.getLogger(GGraph.class);
	private String accessToken;

	public GGraph(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getGBGraph() {
		String graph = null;
		try {

			String g = "https://www.googleapis.com/plus/v1/people/me?access_token="
					+ accessToken;
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
			throw new RuntimeException("ERROR in getting GG graph data. " + e);
		}
		return graph;
	}

	public Map<String, String> getGraphData(String gGraph) {
		Map<String, String> ggProfile = new HashMap<String, String>();
		try {
			JSONObject json = new JSONObject(gGraph);
			ggProfile.put("displayName", json.getString("displayName"));
			ggProfile.put("id", json.getString("id"));
			JSONArray emails = null;
			if (json.has("emails")) {
				emails = json.getJSONArray("emails");
				JSONObject email = new JSONObject(emails.get(0).toString());
				ggProfile.put("email", email.getString("value"));
			}

			if (json.has("gender")) {
				ggProfile.put("gender", json.getString("gender"));
			}

		} catch (JSONException e) {
			e.printStackTrace();
			throw new RuntimeException("ERROR in parsing FB graph data. " + e);
		}
		return ggProfile;
	}
}