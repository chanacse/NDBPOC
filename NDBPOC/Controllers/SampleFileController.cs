using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DBServices;
using System.Data.Entity;

namespace NDBPOC.Controllers
{
    public class SampleFileController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(NDBPOCDB.NDBCompanyFiles.AsEnumerable());
        }
        public HttpResponseMessage Post([FromBody]NDBCompanyFile value)
        {
            NDBPOCDB.NDBCompanyFiles.Add(value);
            return ToJson(NDBPOCDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]NDBCompanyFile value)
        {
            NDBPOCDB.Entry(value).State = EntityState.Modified;
            return ToJson(NDBPOCDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            NDBPOCDB.NDBCompanyFiles.Remove(NDBPOCDB.NDBCompanyFiles.FirstOrDefault(x => x.FID == id));
            return ToJson(NDBPOCDB.SaveChanges());
        }


        //[Route("api/SampleFile/{companyName}")]
        //public HttpResponseMessage GET(string companyName)
        //{
        //    var item = NDBPOCDB.NDBCompanyFiles.Where(x => x.Cname == companyName).AsEnumerable();
        //    return ToJson(item);
        //}

    }
}
