using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DBServices;
using Newtonsoft.Json;
using System.Text;

namespace NDBPOC.Controllers
{
    public class BaseAPIController : ApiController
    {
        protected readonly NDBPOCDBEntities NDBPOCDB = new NDBPOCDBEntities();
        protected HttpResponseMessage ToJson(dynamic obj)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json");
            return response;
        }
    }
}
