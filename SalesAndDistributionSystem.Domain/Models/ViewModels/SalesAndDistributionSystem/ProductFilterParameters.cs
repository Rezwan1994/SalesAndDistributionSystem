using System;
using System.Collections.Generic;
using System.Text;

namespace SalesAndDistributionSystem.Domain.Models.ViewModels.SalesAndDistributionSystem
{
    public class ProductFilterParameters
    {
        public List<string> SKU_ID { get; set; }
        public List<string> BRAND_ID { get; set; }
        public List<string> CATEGORY_ID { get; set; }
        public List<string> BASE_PRODUCT_ID { get; set; }
        public List<string> GROUP_ID { get; set; }

        public string UNIT_ID { get; set; }
        public int COMPANY_ID { get; set; }

    }
}
