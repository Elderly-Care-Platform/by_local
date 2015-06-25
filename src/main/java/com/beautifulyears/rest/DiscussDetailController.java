package com.beautifulyears.rest;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.DiscussDetailResponse;

@Controller
@RequestMapping("/discussDetail")
public class DiscussDetailController {
	private static final Logger logger = Logger
			.getLogger(DiscussDetailController.class);
	private MongoTemplate mongoTemplate;
	private DiscussRepository discussRepository;
	private DiscussReplyRepository discussReplyRepository;

	@Autowired
	public DiscussDetailController(MongoTemplate mongoTemplate,
			DiscussRepository discussRepository,
			DiscussReplyRepository discussReplyRepository) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
		this.discussReplyRepository = discussReplyRepository;
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
			
			Query query = new Query();
			query.addCriteria(Criteria.where("discussId")
					.is(discussId)).addCriteria(Criteria.where("status")
					.is(DiscussConstants.REPLY_STATUS_ACTIVE));
			query.with(new Sort(Sort.Direction.ASC, new String[] { "createdAt" }));
			List<DiscussReply> replies = this.mongoTemplate.find(query,DiscussReply.class);
			
			response.addReplies(replies,Util.getSessionUser(req));
		}

		return response.getResponse();

	}

	@RequestMapping(method = { RequestMethod.POST }, params = "type=0", consumes = { "application/json" })
	@ResponseBody
	public DiscussDetailResponse submitComment(@RequestBody DiscussReply comment,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		logger.debug("request for posting reply of type comment");
		String discussId = comment.getDiscussId();
		Discuss discuss = discussRepository.findOne(discussId);
		List<DiscussReply> ancestors =null;
		if (null != discuss) {
			comment.setDiscussId(discuss.getId());
			comment.setReplyType(DiscussConstants.DISCUSS_TYPE_COMMENT);
			User user = Util.getSessionUser(req);
			if (null != user) {
				comment.setUserId(user.getId());
				comment.setUserName(user.getUserName());
			} else {
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
			if(!Util.isEmpty(comment.getParentReplyId())){
				//if nested comment
				DiscussReply parentComment = discussReplyRepository.findOne(comment.getParentReplyId());
				if(null != parentComment){
					parentComment.setDirectChildrenCount(parentComment.getDirectChildrenCount() + 1);	
					comment.getAncestorsId().addAll(parentComment.getAncestorsId());
					comment.getAncestorsId().add(parentComment.getId());
					comment.setParentReplyId(parentComment.getId());
					mongoTemplate.save(parentComment);
				}
				Query query = new Query();
				query.addCriteria(Criteria.where("id")
						.in(comment.getAncestorsId()));
				ancestors = this.mongoTemplate.find(query,DiscussReply.class);
				for (DiscussReply ancestor : ancestors) {
					ancestor.setChildrenCount(ancestor.getChildrenCount() + 1);	
					mongoTemplate.save(ancestor);
				}
				
			}
			discuss.setAggrReplyCount(discuss.getAggrReplyCount() + 1);
			mongoTemplate.save(discuss);
			mongoTemplate.save(comment);
		} else {
			res.sendError(HttpServletResponse.SC_NO_CONTENT);
		}
		return getDiscussDetail(req, res, discussId);
	}

	@RequestMapping(method = { RequestMethod.POST }, params = "type=1", consumes = { "application/json" })
	@ResponseBody
	public DiscussDetailResponse submitAnswer(@RequestBody DiscussReply answer,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		logger.debug("request for posting reply of type comment");
		String discussId = answer.getDiscussId();
		Discuss discuss = discussRepository.findOne(discussId);
		if (null != discuss) {
			answer.setDiscussId(discuss.getId());
			answer.setReplyType(DiscussConstants.DISCUSS_TYPE_ANSWER);
			answer.setParentReplyId(null);
			User user = Util.getSessionUser(req);
			if (null != user) {
				answer.setUserId(user.getId());
				answer.setUserName(user.getUserName());
			} else {
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
			discuss.setAggrReplyCount(discuss.getAggrReplyCount() + 1);
			mongoTemplate.save(discuss);
			mongoTemplate.save(answer);
		} else {
			res.sendError(HttpServletResponse.SC_NO_CONTENT);
		}
		return getDiscussDetail(req, res, discussId);
	}

}
