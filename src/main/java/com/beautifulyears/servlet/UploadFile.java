package com.beautifulyears.servlet;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadDir = "";

	public void init() {
		System.out.println("Inside INIT of File Upload Servlet");
		// uploadDir = getServletContext().getInitParameter("file-upload") ==
		// null ? "/uploaded_files/"
		// : getServletContext().getInitParameter("file-upload");
		System.out.println("CONTEXT PATH ===== "
				+ getServletContext().getContextPath());
		uploadDir = getServletContext().getInitParameter("file-upload") == null ? getServletContext().getRealPath("/") + "uploaded_files/"
				: getServletContext().getInitParameter("file-upload");

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Inside do post of file upload servlet");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		// process only if its multipart content
		if (isMultipart) {
			System.out.println("Inside isMultipart");
			// Create a factory for disk-based file items
			FileItemFactory factory = new DiskFileItemFactory();

			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);
			try {
				// Parse the request
				List<FileItem> multiparts = upload.parseRequest(request);
				PrintWriter out = response.getWriter();
				for (FileItem item : multiparts) {
					if (!item.isFormField()) {
						// Generating unique UUID
						UUID fname = UUID.randomUUID();
						String name = new File(item.getName()).getName();
						String extension = name
								.substring(name.lastIndexOf(".") + 1);
						item.write(new File(uploadDir + File.separator + fname
								+ "." + extension));
						// out.println("Hello!!");
						out.println("localhost:8080/uploaded_files/" + fname + "." + extension);
						//?????out.println("52.74.82.29/uploaded_files/" + fname + "." + extension);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("File upload failed");
			}
		}
	}
}