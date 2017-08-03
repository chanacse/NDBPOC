using DBServices;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NDBPOC.Controllers
{
    public class UserController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(NDBPOCDB.NDBLoginDetails.AsEnumerable());
        }
        public HttpResponseMessage Post([FromBody]NDBLoginDetail value)
        {
            NDBPOCDB.NDBLoginDetails.Add(value);
            return ToJson(NDBPOCDB.SaveChanges());

        }
        public HttpResponseMessage Put(int id, [FromBody]NDBLoginDetail value)
        {
            NDBPOCDB.Entry(value).State = EntityState.Modified;
            return ToJson(NDBPOCDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            NDBPOCDB.NDBLoginDetails.Remove(NDBPOCDB.NDBLoginDetails.FirstOrDefault(x => x.ID == id));
            return ToJson(NDBPOCDB.SaveChanges());
        }
    }
}
