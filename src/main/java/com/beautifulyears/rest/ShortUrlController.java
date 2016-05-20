package com.beautifulyears.rest;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.ShortUrl;

@Controller
@RequestMapping("/shortUrl")
public class ShortUrlController {

	public static MongoTemplate mongoTemlate;

	@Autowired
	public ShortUrlController(MongoTemplate mongoTemlate) {
		ShortUrlController.mongoTemlate = mongoTemlate;
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody Object getShortUrl(@RequestParam String url, HttpServletRequest req,
			HttpServletResponse res) {
		
		System.out.println("making short Url for - "+url);
		ShortUrl su = findUrl(url);
		if(null == su){
			String urlId = getHashCode();
			String sUrl = "http://blyrs.co/BY/surl?q=" + urlId;
			su = new ShortUrl();
			su.setUrlId(urlId);
			su.setActualUrl(url);
			su.setShortUrl(sUrl);
			su.setCreateAt(new Date());
			mongoTemlate.save(su);
		}
		
		return su.getShortUrl();
	}
	

	private String getHashCode() {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		DataOutputStream dos = new DataOutputStream(baos);
		UUID uuid = UUID.randomUUID();
		String encoded = null;
		boolean isNew = true;
		String shortUrlKey = null;
		while (isNew) {
			try {
				dos.writeLong(uuid.getMostSignificantBits());

				encoded = new String(Base64.encodeBase64(baos.toByteArray(),
						false, true), "ISO-8859-1");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}

			shortUrlKey = encoded.substring(0, 6);
			Query q = new Query();
			q.addCriteria(Criteria.where("urlId").is(shortUrlKey));
			if (null == mongoTemlate.findOne(q, ShortUrl.class)) {
				isNew = false;
			}
		}

		return shortUrlKey;
	}
	
	public static String getUrl(String urlId){
		Query q = new Query();
		q.addCriteria(Criteria.where("urlId").is(urlId));
		ShortUrl su = mongoTemlate.findOne(q, ShortUrl.class);
		String url = "";
		if(null != su){
			url = su.getActualUrl();
		}
		
		return url;
	}
	
	public static ShortUrl findUrl(String url){
		Query q = new Query();
		q.addCriteria(Criteria.where("actualUrl").is(url));
		ShortUrl su = mongoTemlate.findOne(q, ShortUrl.class);
		return su;
	}

}
