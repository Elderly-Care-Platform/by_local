package com.beautifulyears.servlet;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sourceforge.barbecue.Barcode;
import net.sourceforge.barbecue.BarcodeException;
import net.sourceforge.barbecue.BarcodeFactory;
import net.sourceforge.barbecue.BarcodeImageHandler;
import net.sourceforge.barbecue.output.OutputException;

import org.apache.log4j.Logger;

import com.beautifulyears.constants.BYConstants;

public class GenerateBarCode extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String uploadDir = BYConstants.IMAGE_CDN_PATH;

	private static final Logger logger = Logger
			.getLogger(GenerateBarCode.class);

	public void init() {
		System.out.println("CONTEXT PATH ===== "
				+ getServletContext().getContextPath());
		System.out.println(getServletContext().getInitParameter(
				"imageUploadPath"));
		if (null != getServletContext().getInitParameter("imageUploadPath")) {
			uploadDir = getServletContext().getInitParameter("imageUploadPath");
		}
		// uploadDir = "/home/ubuntu/uploads";
		// uploadDir = "c:/uploads";

	}

	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String dataString = request.getParameter("barcodeString");
		String path = null;
		Barcode b;
		try {
			b = BarcodeFactory.createCode128(dataString);

			BufferedImage barImage = BarcodeImageHandler.getImage(b);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ImageIO.write(barImage, "PNG", out);
			byte[] bytes = out.toByteArray();
//			File f = new File("myFile");
//			File newFile = new File(uploadDir + File.separator
//					+ dataString + ".jpeg");
//			OutputStream outputStream = new FileOutputStream(f);
//			out.writeTo(outputStream);
			
			path =  uploadDir + File.separator +"barcodes/"+ dataString +  "." + "jpeg";
			File f = new File(uploadDir + File.separator +"barcodes/"+ dataString +  "." + "jpeg");
			ImageIO.write(barImage, "jpeg", f);
			
		} catch (BarcodeException e) {
			e.printStackTrace();
		} catch (OutputException e) {
			e.printStackTrace();
		}
		response.getWriter().write(path);
	}

}