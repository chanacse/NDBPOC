﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DBServices
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class NDBPOCDBEntities : DbContext
    {
        public NDBPOCDBEntities()
            : base("name=NDBPOCDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<NDBChequeOption> NDBChequeOptions { get; set; }
        public virtual DbSet<NDBCompany> NDBCompanies { get; set; }
        public virtual DbSet<NDBCompanyFile> NDBCompanyFiles { get; set; }
        public virtual DbSet<NDBShareOfferCode> NDBShareOfferCodes { get; set; }
        public virtual DbSet<NDBShareType> NDBShareTypes { get; set; }
        public virtual DbSet<NDBTransaction> NDBTransactions { get; set; }
        public virtual DbSet<NDBTemplate> NDBTemplates { get; set; }
        public virtual DbSet<NDBLoginDetail> NDBLoginDetails { get; set; }
    }
}
