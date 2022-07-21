﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution
{
    public class Brand_Info
    {

        public int BRAND_ID { get;set;}
        public string BRAND_NAME { get;set;}
        public string BRAND_CODE { get; set; }
        public string STATUS { get; set; }
        public string REMARKS { get; set; }
        public int COMPANY_ID { get; set; }
        public string ENTERED_BY { get; set; }
        public string ENTERED_DATE { get; set; }
        public string ENTERED_TERMINAL { get; set; }
        public string UPDATED_BY { get; set; }
        public string UPDATED_DATE { get; set; }
        public string UPDATED_TERMINAL { get; set; }


        //Helper Attributes
        public int ROW_NO { get; set; }

    }
}
