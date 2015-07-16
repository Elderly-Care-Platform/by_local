/**
 * 
 */
package com.beautifulyears.mail;

import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;

import com.beautifulyears.domain.User;
import com.beautifulyears.rest.UserController;

/**
 * @author Nitin
 *
 */
public class MailHandler {
	private static final String user = "support@beautifulyears.com";
	private static final String pass = "BY2015@)!%";
	private static final String SMTP = "smtp.gmail.com";
	private static final String SMTP_PORT = "587";
	private static final String FROM = "support@beautifulyears.com";

	private static class MailDispatcher implements Runnable {
		private String to;
		private String subject;
		private String body;
		private Logger logger = Logger.getLogger(MailDispatcher.class);

		public MailDispatcher(String to, String subject, String body) {
			this.to = to;
			this.subject = subject;
			this.body = body;
		}

		@Override
		public void run() {
			Properties props = new Properties();
			props.put("mail.smtp.host", SMTP);
			props.put("mail.smtp.port", SMTP_PORT);
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			Session session = Session.getInstance(props,
					new javax.mail.Authenticator() {
						protected PasswordAuthentication getPasswordAuthentication() {
							return new PasswordAuthentication(user, pass);
						}
					});

			try {
				logger.debug("mail request for "+to+" with subject "+subject+" arrived");
				MimeMessage message = new MimeMessage(session);
				message.setFrom(new InternetAddress(FROM));
				message.setReplyTo(new Address [] {new InternetAddress(FROM)});
				message.addRecipient(Message.RecipientType.TO,
						new InternetAddress(to));
				message.setSubject(subject);
				message.setContent(body, "text/html");
				Transport.send(message);
				logger.debug("email sent successfully to "+to);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}

	public static void sendMail(String to, String subject, String body) {
		new Thread(new MailDispatcher(to, subject, body)).start();
	}
	
	public static void sendMailToUserId(String userId, String subject, String body) {
		User  user = UserController.getUser(userId);
		if(null != user){
			new Thread(new MailDispatcher(user.getEmail(), subject, body)).start();
		}
		
	}
}
