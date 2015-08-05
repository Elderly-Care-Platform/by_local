/**
 * 
 */
package com.beautifulyears.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.ParserConfigurationException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xml.sax.SAXException;

/**
 * @author Nitin
 *
 */
public class WebPageParser {
	
	private String url;
	private StringBuilder html = new StringBuilder();
	private Document doc;
	private static final Pattern PIPE_SPLITTER = Pattern.compile(Pattern.quote("|"));
	private static final Pattern DASH_SPLITTER = Pattern.compile(Pattern.quote("-"));
	private static final Pattern ARROWS_SPLITTER = Pattern.compile(Pattern.quote("»"));
	private static final Pattern COLON_SPLITTER = Pattern.compile(Pattern.quote(":"));
	
	public WebPageParser(String url) throws IOException, SAXException, ParserConfigurationException{
		this.url = url;
		URL u = new URL(this.url);
		URLConnection conn = u.openConnection();

		ContentType contentType = getContentTypeHeader(conn);
		if (!contentType.contentType.equals("text/html"))
			html = null; // don't continue if not HTML
		else {
			Charset charset = getCharset(contentType);
			if (charset == null)
				charset = Charset.defaultCharset();

			InputStream in = conn.getInputStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					in, charset));
			int n = 0, totalRead = 0;
			char[] buf = new char[1024];

			while (totalRead < 8192
					&& (n = reader.read(buf, 0, buf.length)) != -1) {
				html.append(buf, 0, n);
				totalRead += n;
			}
		}
		
		doc = Jsoup.parse(html.toString());
	}
	
	
	
	

	public String getPageTitle() throws IOException {
			String titleText = null;
			Elements metaOgTitle = doc.select("meta[property=og:title]");
		    if (metaOgTitle!=null) {
		    	titleText = metaOgTitle.attr("content");
		    }
		    else {
		    	titleText = doc.title();
		    }
			
			Boolean usedDelimeter = false;
				      if (titleText.contains("|")) {
				        titleText = doTitleSplits(titleText, PIPE_SPLITTER);
				        usedDelimeter = true;
				      }
				      if (!usedDelimeter && titleText.contains("-")) {
				        titleText = doTitleSplits(titleText, DASH_SPLITTER);
				        usedDelimeter = true;
				      }
				      if (!usedDelimeter && titleText.contains("»")) {
				        titleText = doTitleSplits(titleText, ARROWS_SPLITTER);
				        usedDelimeter = true;
				      }
				      if (!usedDelimeter && titleText.contains(":")) {
				        titleText = doTitleSplits(titleText, COLON_SPLITTER);
				      }
			
			return titleText;	
		}
	
	public String getDescription(){
		return getMetaTag(doc, "description");
	}
	
	public String getImage(){
		String imageUrl = null;
	    Elements metaOgImage = doc.select("meta[property=og:image]");
	    if (metaOgImage!=null) {
	        imageUrl = metaOgImage.attr("content");
	    }
	    return imageUrl;
	}
	
	private String getMetaTag(Document document, String attr) {
	    Elements elements = document.select("meta[name=" + attr + "]");
	    for (Element element : elements) {
	        final String s = element.attr("content");
	        if (s != null) return s;
	    }
	    elements = document.select("meta[property=" + attr + "]");
	    for (Element element : elements) {
	        final String s = element.attr("content");
	        if (s != null) return s;
	    }
	    return null;
	}
	
	private String doTitleSplits(String title, Pattern delimiter){
		    int largetTextLen = 0;
		    int largeTextIndex = 0;
		    String[] titlePieces = delimiter.split(title);
		    int i =0;
		    while (i < titlePieces.length) {

		    	String current = titlePieces[i];
		      if (current.length() > largetTextLen) {
		        largetTextLen = current.length();
		        largeTextIndex = i;
		      }
		      i += 1;
		    }
		    return titlePieces[largeTextIndex].trim();
		  }

	/**
	 * Loops through response headers until Content-Type is found.
	 * 
	 * @param conn
	 * @return ContentType object representing the value of the Content-Type
	 *         header
	 */
	private ContentType getContentTypeHeader(URLConnection conn) {
		int i = 0;
		boolean moreHeaders = true;
		do {
			String headerName = conn.getHeaderFieldKey(i);
			String headerValue = conn.getHeaderField(i);
			if (headerName != null && headerName.equals("Content-Type"))
				return new ContentType(headerValue);

			i++;
			moreHeaders = headerName != null || headerValue != null;
		} while (moreHeaders);

		return null;
	}

	private Charset getCharset(ContentType contentType) {
		if (contentType != null && contentType.charsetName != null
				&& Charset.isSupported(contentType.charsetName))
			return Charset.forName(contentType.charsetName);
		else
			return null;
	}

	/**
	 * Class holds the content type and charset (if present)
	 */
	private final class ContentType {
		private final Pattern CHARSET_HEADER = Pattern.compile(
				"charset=([-_a-zA-Z0-9]+)", Pattern.CASE_INSENSITIVE
						| Pattern.DOTALL);

		private String contentType;
		private String charsetName;

		private ContentType(String headerValue) {
			if (headerValue == null)
				throw new IllegalArgumentException(
						"ContentType must be constructed with a not-null headerValue");
			int n = headerValue.indexOf(";");
			if (n != -1) {
				contentType = headerValue.substring(0, n);
				Matcher matcher = CHARSET_HEADER.matcher(headerValue);
				if (matcher.find())
					charsetName = matcher.group(1);
			} else
				contentType = headerValue;
		}
	}
}
