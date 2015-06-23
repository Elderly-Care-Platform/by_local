package com.beautifulyears.interceptors;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.SessionRepository;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;
@Service
public class SessionInterceptor extends HandlerInterceptorAdapter {
	private static final Logger logger = Logger
			.getLogger(SessionInterceptor.class);

	@Autowired
	private UserRepository userRepository;
	@Autowired 
	private MongoTemplate mongoTemplate;
	
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		String sessionId = request.getHeader("sess");
		if ((!"null".equals(sessionId) && null != sessionId && !sessionId
				.isEmpty())
				&& (null == request.getSession().getAttribute("session") || null == request
						.getSession().getAttribute("user"))) {
			Query q = new Query();
			q.addCriteria(Criteria.where("sessionId").is(sessionId));
			Session session = mongoTemplate.findOne(q, Session.class);
			if (null != session) {
				User user = userRepository.findOne(session.getUserId());
				request.getSession().setAttribute("session", session);
				request.getSession().setAttribute("user", user);
			}
		}
		return true;
	};

}
