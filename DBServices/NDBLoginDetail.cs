//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class NDBLoginDetail
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public bool isActive { get; set; }
        public string RoleType { get; set; }
        public string Email { get; set; }
        public string CurrentManager { get; set; }
    }
}
