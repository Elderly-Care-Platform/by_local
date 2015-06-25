package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;

@Controller
@RequestMapping("/reply")
public class DiscussReplyController {
	private Logger logger = LoggerFactory
			.getLogger(DiscussReplyController.class);

	private DiscussReplyRepository discussReplyRepository;
	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussReplyController(
			DiscussReplyRepository discussReplyRepository,
			DiscussRepository discussRepository, MongoTemplate mongoTemplate) {
		this.discussReplyRepository = discussReplyRepository;
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

}