/**
 * 
 */
package com.beautifulyears.rest;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */

@Controller
@RequestMapping("/products")
public class ProductsProxyController {

	@RequestMapping("/**")
	@ResponseBody
	public String mirrorProductsRest(@RequestBody String body,
			HttpMethod method, HttpServletRequest request,
			HttpServletResponse response) throws URISyntaxException {
		String server = System.getProperty("productServerHost");
		int port = Integer.parseInt(System.getProperty("productServerPort"));
		RestTemplate restTemplate = new RestTemplate();
		if (null != request.getRequestURI()
				&& request.getRequestURI().indexOf("/products") > -1) {
			String[] path = request.getRequestURI().split("/products");
			try {
				path[1] = URLDecoder.decode(path[1], "UTF-8");
			} catch (UnsupportedEncodingException e) {
				path[1] = path[1];
			}
			URI uri = new URI("http", null, server, port, path[1],
					request.getQueryString(), null);
			System.out.println(uri.toString());
			Util.logStats(HousingController.staticMongoTemplate, request,
					"product post operation", null, null, null, null, null,
					Arrays.asList(path[1]), uri.toString(), "PRODUCT");
			HttpHeaders headers = copyHeader(request, new HttpHeaders());
			HttpEntity<String> entity = new HttpEntity<String>(body, headers);

			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					method, entity, String.class);

			return responseEntity.getBody();
		} else {
			return null;
		}

	}

	@RequestMapping(value = { "/**" }, method = { RequestMethod.DELETE })
	@ResponseBody
	public String mirrorDELETEProductsRest(HttpMethod method,
			HttpServletRequest request, HttpServletResponse response)
			throws URISyntaxException {
		String server = System.getProperty("productServerHost");
		int port = Integer.parseInt(System.getProperty("productServerPort"));
		RestTemplate restTemplate = new RestTemplate();
		if (null != request.getRequestURI()
				&& request.getRequestURI().indexOf("/products") > -1) {
			String[] path = request.getRequestURI().split("/products");
			try {
				path[1] = URLDecoder.decode(path[1], "UTF-8");
			} catch (UnsupportedEncodingException e) {
				path[1] = path[1];
			}
			URI uri = new URI("http", null, server, port, path[1],
					request.getQueryString(), null);
			System.out.println(uri.toString());
			Util.logStats(HousingController.staticMongoTemplate, request,
					"product delete operation", null, null, null, null, null,
					Arrays.asList(path[1]), uri.toString(), "PRODUCT");
			HttpHeaders headers = copyHeader(request, new HttpHeaders());
			HttpEntity<String> entity = new HttpEntity<String>(headers);

			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					method, entity, String.class);

			return responseEntity.getBody();
		} else {
			return null;
		}

	}

	@RequestMapping(value = { "/**" }, method = { RequestMethod.PUT })
	@ResponseBody
	public String mirrorPUTProductsRest(@RequestBody String body,
			HttpMethod method, HttpServletRequest request,
			HttpServletResponse response) throws URISyntaxException {
		String server = System.getProperty("productServerHost");
		int port = Integer.parseInt(System.getProperty("productServerPort"));
		RestTemplate restTemplate = new RestTemplate();
		if (null != request.getRequestURI()
				&& request.getRequestURI().indexOf("/products") > -1) {
			String[] path = request.getRequestURI().split("/products");
			try {
				path[1] = URLDecoder.decode(path[1], "UTF-8");
			} catch (UnsupportedEncodingException e) {
				path[1] = path[1];
			}
			URI uri = new URI("http", null, server, port, path[1],
					request.getQueryString(), null);
			System.out.println(uri.toString());
			Util.logStats(HousingController.staticMongoTemplate, request,
					"product update operation", null, null, null, null, null,
					Arrays.asList(path[1]), uri.toString(), "PRODUCT");
			HttpHeaders headers = copyHeader(request, new HttpHeaders());
			HttpEntity<String> entity = new HttpEntity<String>(body, headers);

			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					method, entity, String.class);

			return responseEntity.getBody();
		} else {
			return null;
		}

	}

	@RequestMapping(value = { "/**" }, method = { RequestMethod.GET })
	@ResponseBody
	public String mirrorGETProductsRest(HttpMethod method,
			HttpServletRequest request, HttpServletResponse response)
			throws URISyntaxException {
		String server = System.getProperty("productServerHost");
		int port = Integer.parseInt(System.getProperty("productServerPort"));
		RestTemplate restTemplate = new RestTemplate();

		if (null != request.getRequestURI()
				&& request.getRequestURI().indexOf("/products") > -1) {
			String[] path = request.getRequestURI().split("/products", 2);
			try {
				path[1] = URLDecoder.decode(path[1], "UTF-8");
			} catch (UnsupportedEncodingException e) {
				path[1] = path[1];
			}
			URI uri = new URI("http", null, server, port, path[1],
					request.getQueryString(), null);
			System.out.println(uri.toString());
			Util.logStats(HousingController.staticMongoTemplate, request,
					"product product get operation", null, null, null, null,
					null, Arrays.asList(path[1]), uri.toString(), "PRODUCT");
			HttpHeaders headers = copyHeader(request, new HttpHeaders());
			HttpEntity<String> entity = new HttpEntity<String>(headers);

			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					method, entity, String.class);

			return responseEntity.getBody();
		} else {
			return null;
		}

	}

	@RequestMapping(value = { "/images/**" }, method = { RequestMethod.GET })
	@ResponseBody
	public HttpEntity<byte[]> mirrorGETProductsImage(HttpMethod method,
			HttpServletRequest request, HttpServletResponse response)
			throws URISyntaxException {
		String server = System.getProperty("productServerHost");
		int port = Integer.parseInt(System.getProperty("productServerPort"));
		RestTemplate restTemplate = new RestTemplate();

		if (null != request.getRequestURI()
				&& request.getRequestURI().indexOf("/products/images") > -1) {
			String[] path = request.getRequestURI()
					.split("/products/images", 2);
			try {
				path[1] = URLDecoder.decode(path[1], "UTF-8");
			} catch (UnsupportedEncodingException e) {
				path[1] = path[1];
			}
			URI uri = new URI("http", null, server, port, path[1],
					request.getQueryString(), null);
			System.out.println(uri.toString());
			HttpHeaders headers = copyHeader(request, new HttpHeaders());
			HttpEntity<byte[]> entity = new HttpEntity<byte[]>(headers);

			ResponseEntity<byte[]> responseEntity = restTemplate.exchange(uri,
					method, entity, byte[].class);
			headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_JPEG);
			headers.setContentLength(responseEntity.getBody().length);

			return new HttpEntity<byte[]>(responseEntity.getBody(), headers);

		} else {
			return null;
		}

	}

	private HttpHeaders copyHeader(HttpServletRequest request,
			HttpHeaders header) {
		Enumeration<String> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = headerNames.nextElement();
			Enumeration<String> headers = request.getHeaders(headerName);
			while (headers.hasMoreElements()) {
				String headerValue = headers.nextElement();
				header.set(headerName, headerValue);
			}
		}
		if (null != Util.getSessionUser(request)) {
			Session currentSession = (Session) request.getSession()
					.getAttribute("session");
			User currentUser = Util.getSessionUser(request);
			header.set("userId", currentUser.getId());
			header.set("sessionId", request.getHeader("sess"));
			header.set("email", currentUser.getEmail());
			header.set("userName", currentUser.getUserName());
			if (null != currentSession) {
				header.set("sessionType",
						String.valueOf(currentSession.getSessionType()));
			}

		}
		System.out.println(header.toString());
		return header;
	}

}
