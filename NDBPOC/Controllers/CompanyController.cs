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
    public class CompanyController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(NDBPOCDB.NDBCompanies.AsEnumerable());
        }


        public HttpResponseMessage Post([FromBody]NDBCompany value)
        {
            NDBPOCDB.NDBCompanies.Add(value);
            return ToJson(NDBPOCDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]NDBCompany value)
        {
            NDBPOCDB.Entry(value).State = EntityState.Modified;
            return ToJson(NDBPOCDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            NDBPOCDB.NDBCompanies.Remove(NDBPOCDB.NDBCompanies.FirstOrDefault(x => x.CID == id));
            return ToJson(NDBPOCDB.SaveChanges());
        }
    }
}
