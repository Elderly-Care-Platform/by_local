package com.beautifulyears.rest;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.DiscussDetailResponse;

@Controller
@RequestMapping("/discussDetail")
public class DiscussDetailController {
	private static final Logger logger = Logger
			.getLogger(DiscussDetailController.class);
	private MongoTemplate mongoTemplate;
	private DiscussRepository discussRepository;

	@Autowired
	public DiscussDetailController(MongoTemplate mongoTemplate,
			DiscussRepository discussRepository) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "" }, produces = { "application/json" })
	@ResponseBody
	public DiscussDetailResponse getDiscussDetail(HttpServletRequest req,
			HttpServletResponse res,
			@RequestParam(value = "discussId", required = true) String discussId) {
		Discuss discuss = discussRepository.findOne(discussId);
		DiscussDetailResponse response = null;
		if (null != discuss) {
			response = new DiscussDetailResponse();
			response.addDiscuss(discuss, Util.getSessionUser(req));
		}

		return response.getResponse();

	}

	@RequestMapping(method = { RequestMethod.POST }, params = "type=0", consumes = { "application/json" })
	@ResponseBody
	public DiscussDetailResponse submitComment(HttpServletRequest req,
			HttpServletResponse res,@RequestBody DiscussReply answer) {
		logger.debug("request for posting reply of type comment");
		return null;
	}
	
	@RequestMapping(method = { RequestMethod.POST }, params = "type=1", consumes = { "application/json" })
	@ResponseBody
	public DiscussDetailResponse submitAnswer(@RequestBody DiscussReply answer,HttpServletRequest req, HttpServletResponse res) throws IOException {
		logger.debug("request for posting reply of type comment");
		Discuss discuss = discussRepository.findOne(answer.getDiscussId());
		if(null != discuss){
			discuss.setAggrReplyCount(discuss.getAggrReplyCount() +1);
			answer.setDiscussId(discuss.getId());
			answer.setReplyType(DiscussReply.REPLY_TYPE_ANSWER);
			User user = Util.getSessionUser(req);
			if(null != user){
				answer.setUserId(user.getId());
				answer.setUserName(user.getUserName());
			}else{
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
			mongoTemplate.save(discuss);
			mongoTemplate.save(answer);
		}
		return null;
	}


}
