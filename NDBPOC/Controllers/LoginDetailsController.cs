using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NDBPOC.Controllers
{
    public class LoginDetailsController : BaseAPIController
    {
        [Route("api/LoginDetails/{username}/{password}")]
        public HttpResponseMessage GET(string username, string password)
        {
            return ToJson(NDBPOCDB.NDBLoginDetails.Find(NDBPOCDB.NDBLoginDetails.FirstOrDefault(x => x.LoginName == username && x.Password == password)));

            //return ToJson(NDBPOCDB.NDBLoginDetails.AsEnumerable());

        }
    }
}
