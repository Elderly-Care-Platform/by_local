package com.beautifulyears.domain;

import java.util.List;

public class EmailInfo {
	
	private List<String> emailIds;
	private String subject;
	private String body;
	public List<String> getEmailIds() {
		return emailIds;
	}
	public void setEmailIds(List<String> emailIds) {
		this.emailIds = emailIds;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	@Override
	public String toString() {
		return "EmailInfo [emailIds=" + emailIds + ", subject=" + subject + ", body=" + body + "]";
	}
	
	
}