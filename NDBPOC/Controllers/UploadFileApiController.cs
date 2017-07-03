using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace NDBPOC.Controllers
{
    public class UploadFileApiController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage UploadJsonFile()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var filePath = @"E:/myFiles/" + postedFile.FileName;
                    postedFile.SaveAs(filePath);
                }
            }
            return response;
        }
    }
}
