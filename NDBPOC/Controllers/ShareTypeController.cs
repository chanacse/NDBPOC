using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DBServices;

namespace NDBPOC.Controllers
{
    //public class ShareTypeController : ApiController
    //{
    public class ShareTypeController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(NDBPOCDB.NDBShareTypes.AsEnumerable());
        }

        //public HttpResponseMessage Post([FromBody]TblUser value)
        //{
        //    NDBPOCDB.TblUsers.Add(value);
        //    return ToJson(NDBPOCDB.SaveChanges());
        //}

        //public HttpResponseMessage Put(int id, [FromBody]TblUser value)
        //{
        //    NDBPOCDB.Entry(value).State = EntityState.Modified;
        //    return ToJson(NDBPOCDB.SaveChanges());
        //}
        //public HttpResponseMessage Delete(int id)
        //{
        //    NDBPOCDB.TblUsers.Remove(UserDB.TblUsers.FirstOrDefault(x => x.Id == id));
        //    return ToJson(NDBPOCDB.SaveChanges());
        //}
    }
}
//}
