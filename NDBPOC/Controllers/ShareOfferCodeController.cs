using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NDBPOC.Controllers
{
    public class ShareOfferCodeController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(NDBPOCDB.NDBShareOfferCodes.AsEnumerable());
        }
    }
}
