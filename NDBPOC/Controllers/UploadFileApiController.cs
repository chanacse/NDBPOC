using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace NDBPOC.Controllers
{
    public class UploadFileApiController : BaseAPIController
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
                    if (File.Exists(filePath))
                    {
                        response = new HttpResponseMessage(HttpStatusCode.Conflict);
                    }
                    else
                    {
                        postedFile.SaveAs(filePath);
                        response = new HttpResponseMessage(HttpStatusCode.Accepted);
                    }
                }
            }
            return ToJson(response.StatusCode);
        }

        [Route("api/UploadFileApi/{filepath}")]
        public HttpResponseMessage Get(string filePath)
        {
            HttpResponseMessage httpResp = new HttpResponseMessage();
            try
            {
                filePath = filePath + ".csv";
                var fulldata = File.ReadAllText(Path.Combine(@"E:/myfiles/", filePath));
                return ToJson(fulldata);
            }
            catch { return httpResp; }
        }

    }
}
