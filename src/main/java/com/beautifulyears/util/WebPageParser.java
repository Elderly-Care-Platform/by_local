/**
 * 
 */
package com.beautifulyears.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.ParserConfigurationException;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xml.sax.SAXException;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.LinkInfo;

/**
 * @author Nitin
 *
 */
public class WebPageParser {

	private String url;
	private Document doc;
	private static final Pattern PIPE_SPLITTER = Pattern.compile(Pattern
			.quote("|"));
	private static final Pattern DASH_SPLITTER = Pattern.compile(Pattern
			.quote("-"));
	private static final Pattern ARROWS_SPLITTER = Pattern.compile(Pattern
			.quote("»"));
	private static final Pattern COLON_SPLITTER = Pattern.compile(Pattern
			.quote(":"));

	public WebPageParser(String url) throws IOException, SAXException,
			ParserConfigurationException, URISyntaxException {
		this.url = prepareUrl(url);
		try {
			doc = Jsoup.connect(this.url).userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36").get();
		} catch (Exception e) {

		}

	}

	private String getPageTitle() throws IOException {
		String titleText = null;
		Elements metaOgTitle = doc.select("meta[property=og:title]");
		if (metaOgTitle != null) {
			titleText = metaOgTitle.attr("content");
		}
		if (Util.isEmpty(titleText)) {
			titleText = getMetaTag(doc, "og:title");
		}
		if (Util.isEmpty(titleText)) {
			titleText = doc.title();
		}
		

		return titleText;
	}

	private String getDescription() {
		String desc = getMetaTag(doc, "description");
		if (Util.isEmpty(desc)) {
			desc = getMetaTag(doc, "twitter:description");
		}
		if (Util.isEmpty(desc)) {
			desc = getMetaTag(doc, "og:description");
		}
		return desc;
	}

	private String getImage() {
		String imageUrl = null;
		Elements metaOgImage = doc.select("meta[property=og:image]");
		if (metaOgImage != null) {
			imageUrl = metaOgImage.attr("content");
		}
		if (Util.isEmpty(imageUrl)) {
			imageUrl = getMetaTag(doc, "twitter:image");
		}
		if (Util.isEmpty(imageUrl)) {
			imageUrl = getMetaTag(doc, "og:image");
		}

		return imageUrl;
	}

	private String getMetaTag(Document document, String attr) {
		Elements elements = document.select("meta[name=" + attr + "]");
		for (Element element : elements) {
			final String s = element.attr("content");
			if (s != null)
				return s;
		}
		elements = document.select("meta[property=" + attr + "]");
		for (Element element : elements) {
			final String s = element.attr("content");
			if (s != null)
				return s;
		}
		return null;
	}

	private String doTitleSplits(String title, Pattern delimiter) {
		int largetTextLen = 0;
		int largeTextIndex = 0;
		String[] titlePieces = delimiter.split(title);
		int i = 0;
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


	private String prepareUrl(String url) throws URISyntaxException,
			UnsupportedEncodingException {
		url = java.net.URLDecoder.decode(url, "UTF-8");
		if (!url.matches("^\\w+?://.*")) {
			url = "http://" + url;
		} else {
			// url = url.replace("https://", "http://");
		}
		// url = URLEncoder.encode(url, "UTF-8");
		return url;
	}

	private boolean isImage(String url) throws IOException {
		Pattern r = Pattern.compile("\\.(jpg|png|gif|bmp)$");
		Matcher m = r.matcher(url);
		boolean isImage = false;
		if (m.find()) {
			isImage = true;
		} else {
			if (doc == null) {
				Connection.Response res = Jsoup.connect(this.url)
						.ignoreContentType(true).userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36").execute();
				if (null != res.contentType()
						&& res.contentType().contains("image")) {
					isImage = true;
				}
			}
		}
		return isImage;
	}

	private List<String> getMedia(String url) {
		List<String> $media = new ArrayList<String>();
		if (url.indexOf("youtube.com") != -1) {
			Pattern pattern = Pattern.compile("(.*?)v=(.*?)($|&)");
			Matcher m = pattern.matcher(url);
			if (m.matches()) {
				String videoId = m.group(2);
				$media.add("http://i2.ytimg.com/vi/"+videoId+"/hqdefault.jpg");
				$media.add("http://www.youtube.com/embed/" + videoId);
			} else {
				$media.add("");
				$media.add("");
			}
		} else if (url.indexOf("youtu.be") != -1) {
			String videoId = url.substring(url.lastIndexOf("/") + 1, url.length());
			$media.add("http://i2.ytimg.com/vi/$vid/hqdefault.jpg");
			$media.add("http://www.youtube.com/embed/" + videoId);
		} else if (url.indexOf("vimeo.com") != -1) {
			String videoId = url.substring(url.lastIndexOf("/") + 1,
					url.length());
			if (videoId != "") {
				$media.add("https://f.vimeocdn.com/images_v6/logo.png");
				$media.add("http://player.vimeo.com/video/" + videoId);
			} else {
				$media.add("");
				$media.add("");
			}
		} else if (url.indexOf("vine.co") != -1) {
			$media.add("");
			$media.add("");
		} else if (url.indexOf("metacafe.com") != -1) {
			Pattern p = Pattern
					.compile("metacafe\\.com/watch/([\\w\\-\\_]+)(.*)");
			Matcher m = p.matcher(url);
			if (m.matches()) {
				String videoId = m.group(1);
				System.out.println(videoId);
			} else {
				$media.add("");
				$media.add("");
			}

		} else if (url.indexOf("dailymotion.com") != -1) {
			url = url.substring(url.lastIndexOf("/") + 1, url.length());
			String videoId = url.substring(0, url.indexOf('_'));
			if (videoId != "") {
				$media.add("http://www.dailymotion.com/thumbnail/160x120/video/"
						+ videoId);
				$media.add("http://www.dailymotion.com/embed/video/" + videoId);
			} else {
				$media.add("");
				$media.add("");
			}
		} else if (url.indexOf("collegehumor.com") != -1) {
			$media.add("");
			$media.add("");
		} else if (url.indexOf("blip.tv") != -1) {
			$media.add("");
			$media.add("");
		} else if (url.indexOf("funnyordie.com") != -1) {
			$media.add("");
			$media.add("");
		}
		return $media;
	}

	private List<String> getImages(int imageQuantity) throws IOException {
		// Document doc = Jsoup.parse(text);
		int imgAdded = 0;
		// Document doc = Jsoup.connect(url).get();
		Elements images = doc.select("img");
		Map<Long, String> map = new TreeMap<Long, String>();
		int count = 0;
		for (Element el : images) {
			
			if (imgAdded > imageQuantity - 1 || count > 2*imageQuantity) {
				break;
			}
			long size = getImageSize(el.attr("src"));
			if (size > 5000) {
				System.out.println("adding");
				map.put(size, el.attr("src"));
				imgAdded++;
				count++;
			}

		}
		List<String> ret = new ArrayList<>(map.values());
		Collections.reverse(ret);
		return ret;
	}

	private long getImageSize(String url) throws IOException {
		long size = 0;
		try {
			URL src = new URL(url);
			size = src.openConnection().getContentLength();
			System.out.println(size);
		} catch (Exception e) {

		}
		return size;

	}

	public LinkInfo getUrlDetails() throws IOException, URISyntaxException {
		LinkInfo linkInfo = new LinkInfo();
		linkInfo.setUrl(this.url);
		linkInfo.setDomainName(getDomainName(this.url));
		if (isImage(linkInfo.getUrl())) {
			linkInfo.setType(DiscussConstants.LINK_TYPE_TYPE_IMAGE);
			linkInfo.setMainImage(this.url);
		} else {
			List<String> media = getMedia(linkInfo.getUrl());
			linkInfo.setType(DiscussConstants.LINK_TYPE_TYPE_GENERAL);
			if (media.size() > 0 && !Util.isEmpty(media.get(0))
					&& !Util.isEmpty(media.get(1))) {
				linkInfo.setType(DiscussConstants.LINK_TYPE_TYPE_VIDEO);
				linkInfo.setVideoThumbnail(media.get(0));
				linkInfo.setEmbeddedVideo(media.get(1));
			}
			if (doc != null) {
				linkInfo.setTitle(this.getPageTitle());
				linkInfo.setDescription(getDescription());
				linkInfo.setMainImage(getImage());
				if (linkInfo.getMainImage() == null) {
					linkInfo.setOtherImages(getImages(5));
				}
			}

		}
		return linkInfo;
	}

	private String getDomainName(String url) throws URISyntaxException {
		URI uri = new URI(url);
		String domain = uri.getHost();
		return domain.startsWith("www.") ? domain.substring(4) : domain;
	}
}
