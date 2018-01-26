const config = require("config");

function getHTML(table, stationName, partnerId, date, type) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if gte mso 15]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG />
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>*|MC:SUBJECT|*</title>
    
  <style type="text/css">
		p{
			margin:1em 0;
			padding:0;
		}
		table{
			border-collapse:collapse;
		}
		h1,h2,h3,h4,h5,h6{
			display:block;
			margin:0;
			padding:0;
		}
		img,a img{
			border:0;
			height:auto;
			outline:none;
			text-decoration:none;
		}
		body,#bodyTable,#bodyCell{
			height:100%;
			margin:0;
			padding:0;
			width:100%;
		}
		#outlook a{
			padding:0;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		table{
			mso-table-lspace:0;
			mso-table-rspace:0;
		}
		.ReadMsgBody{
			width:100%;
		}
		.ExternalClass{
			width:100%;
		}
		p,a,li,td,blockquote{
			mso-line-height-rule:exactly;
		}
		a[href^=tel],a[href^=sms]{
			color:inherit;
			cursor:default;
			text-decoration:none;
		}
		p,a,li,td,body,table,blockquote{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
			line-height:100%;
		}
		a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:none !important;
			font-size:inherit !important;
			font-family:inherit !important;
			font-weight:inherit !important;
			line-height:inherit !important;
		}
		#bodyCell{
			padding:9px;
		}
		.templateImage{
			height:auto;
			max-width:564px;
		}
		.templateContainer{
			max-width:600px !important;
		}
		#templatePreheader{
			padding-right:9px;
			padding-left:9px;
		}
		#templatePreheader .columnContainer td{
			padding:0 9px;
		}
		#footerContent{
			padding-top:27px;
			padding-bottom:18px;
		}
		#templateHeader,#templateBody,#templateFooter{
			padding-right:18px;
			padding-left:18px;
		}
	/*
	@tab Page
	@section Background Style
	*/
		body,#bodyTable{
			/*@editable*/background-color:#FAFAFA;
		}
	/*
	@tab Page
	@section Email Border
	*/
		.templateContainer{
			/*@editable*/border:0;
		}
	/*
	@tab Page
	@section Heading 1
	*/
		h1{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:40px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 2
	*/
		h2{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:28px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 3
	*/
		h3{
			/*@editable*/color:#444444;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:22px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 4
	*/
		h4{
			/*@editable*/color:#999999;
			/*@editable*/font-family:Georgia;
			/*@editable*/font-size:20px;
			/*@editable*/font-style:italic;
			/*@editable*/font-weight:normal;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Preheader
	@section Preheader Style
	*/
		#templatePreheader{
			/*@editable*/background-color:#FAFAFA;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:9px;
			/*@editable*/padding-bottom:9px;
		}
	/*
	@tab Preheader
	@section Preheader Text
	*/
		#templatePreheader,#templatePreheader p{
			/*@editable*/color:#656565;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Preheader
	@section Preheader Link
	*/
		#templatePreheader a,#templatePreheader p a{
			/*@editable*/color:#656565;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Header
	@section Header Style
	*/
		#templateHeader{
			/*@editable*/background-color:#ffffff;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:18px;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Header
	@section Header Text
	*/
		#templateHeader,#templateHeader p{
			/*@editable*/color:#606060;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Link
	*/
		#templateHeader a,#templateHeader p a{
			/*@editable*/color:#237A91;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Body
	@section Body Style
	*/
		#templateBody{
			/*@editable*/background-color:#ffffff;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:2px solid #EAEAEA;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:9px;
		}
	/*
	@tab Body
	@section Body Text
	*/
		#templateBody,#templateBody p{
			/*@editable*/color:#606060;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Body
	@section Body Link
	*/
		#templateBody a,#templateBody p a{
			/*@editable*/color:#21759b;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Footer Style
	*/
		#templateFooter{
			/*@editable*/background-color:#fafafa;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:36px;
			/*@editable*/padding-bottom:9px;
		}
	/*
	@tab Footer
	@section Social Bar Style
	*/
		#socialBar{
			/*@editable*/background-color:#333333;
			/*@editable*/border:0;
			/*@editable*/padding:18px;
		}
	/*
	@tab Footer
	@section Social Bar Text
	*/
		#socialBar,#socialBar p{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Social Bar Link
	*/
		#socialBar a,#socialBar p a{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Footer Text
	*/
		#footerContent,#footerContent p{
			/*@editable*/color:#656565;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Footer Link
	*/
		#footerContent a,#footerContent p a{
			/*@editable*/color:#656565;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Utility Bar Style
	*/
		#utilityBar{
			/*@editable*/background-color:#FAFAFA;
			/*@editable*/border:0;
			/*@editable*/padding-top:9px;
			/*@editable*/padding-bottom:9px;
		}
	/*
	@tab Footer
	@section Utility Bar Text
	*/
		#utilityBar,#utilityBar p{
			/*@editable*/color:#656565;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Utility Bar Link
	*/
		#utilityBar a,#utilityBar p a{
			/*@editable*/color:#656565;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	@media only screen and (max-width: 480px){
		body,table,td,p,a,li,blockquote{
			-webkit-text-size-adjust:none !important;
		}

}	@media only screen and (max-width: 480px){
		body{
			width:100% !important;
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.templateImage{
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.columnContainer{
			max-width:100% !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mobileHide{
			display:none;
		}

}	@media only screen and (max-width: 480px){
		.utilityLink{
			display:block;
			padding:9px 0;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 1
	*/
		h1{
			/*@editable*/font-size:22px !important;
			/*@editable*/line-height:175% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 2
	*/
		h2{
			/*@editable*/font-size:20px !important;
			/*@editable*/line-height:175% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 3
	*/
		h3{
			/*@editable*/font-size:18px !important;
			/*@editable*/line-height:175% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 4
	*/
		h4{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:175% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Preheader Visibility
	*/
		#templatePreheader{
			/*@editable*/display:block !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Preheader Text
	*/
		#templatePreheader,#templatePreheader p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Header Text
	*/
		#templateHeader,#templateHeader p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Body Text
	*/
		#templateBody,#templateBody p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Footer Text
	*/
		#templateFooter,#templateFooter p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Social Bar Text
	*/
		#socialBar,#socialBar p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Utility Bar Text
	*/
		#utilityBar,#utilityBar p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}</style></head>
  <body>
    <img width="1px" height="1px" src="${config.get("grainproadmin.url")}/tracking/image/${partnerId}/1x1.gif?date=${date}&type=OPEN"/>
    <center>
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" id="bodyTable" style="height:100%;">
        <tr>
          <td align="center" valign="top" id="bodyCell">
            <!-- BEGIN TEMPLATE // -->
            <!--[if gte mso 9]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
              <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
                  <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
              <!-- BEGIN BODY // -->
              <tr>
                <td valign="top" id="templateBody">
                  <!-- BEGIN MODULE: BODY CONTENT // -->
                  <div mc:edit="body_content">
                    <h2 style="text-align:center;">
                      <span style="color:#777777"><span style="font-size:15px">Grain.pro - это сервис для поиска, сравнения, покупки и продажи пшеницы по всей России</span></span>
                    </h2>
                     
                    <div style="float:left;">
                      <a href="http://grain.pro?from=email"><img alt="logol-17c2168618.png" src="https://grainpro.herokuapp.com/content/images/logol-17c2168618.png"></a>
                    </div>
                    <div style="float:right;text-align:right;">+7 (916) 549-19-89<br><a href="mailto:p@grain.pro" target="_blank">p@grain.pro</a>
                  </div>
                  <br>
                  <br>
                  <!--<br><span style="font-size:22px"><span style="color:#000000"><strong>${type === 'BUY' ? 'Спрос' : 'Предложение'} на пшеницу ${date}, станция ${stationName}</strong></span></span> -->
                  ${table}
                  <p><a href="http://grain.pro/grain-buy/?from=email" style="margin-right:40px;"><span style="color:#21759b">Рассчитать цену объявления с доставкой на любую ж.д. станцию</span></a>
                  <br><a href="http://grain.pro/grain-sell/?from=email"><span style="color:#21759b">Предложение по пшенице</span></a>
                  <br><a href="http://grain.pro/add-bid/?from=email"><span style="color:#21759b">Разместить свое объявление</span></a><span style="color:#21759b"> </span>
                </p>
              </div>
              <!-- // END MODULE: BODY CONTENT -->
            </td>
          </tr>
          <!-- // END BODY -->
          <!-- BEGIN FOOTER // -->
          <tr>
            <td valign="top" id="templateFooter">
              <!-- BEGIN MODULE: STANDARD FOOTER // -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="top" id="footerContent">
                    <div mc:edit="footer_content">
                      Информация, носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями статьи 437 Гражданского кодекса Российской Федерации. Для получения подробных све о стоимости товаров и условиях их поставки просим Вас обращаться к нашим специалистам
                    </div>
                  </td>
                </tr>
              </table>
              <!-- // BEGIN MODULE: STANDARD FOOTER -->
            </td>
          </tr>
          <!-- // END FOOTER -->
        </table>
        <!--[if gte mso 9]>
      </td>
    </tr>
  </table>
  <![endif]-->
        <!-- // END TEMPLATE -->
      </td>
    </tr>
  </table>
</center>
</body>
</html>`;
}

module.exports = {
    getHTML: getHTML
};