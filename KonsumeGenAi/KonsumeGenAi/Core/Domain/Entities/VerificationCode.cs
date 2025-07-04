﻿using Seek.Core.Domain.Entities;
using Seek.Core.Domain.Entities;

namespace Seek.Models.Entities
{
    public class VerificationCode :Auditables
    {
        public int Code { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public int? RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
    }

    public class EmailConfiguration : Auditables
    {
        public string EmailSenderAddress { get; set; }
        public string EmailSenderName { get; set; }
        public string EmailSenderPassword { get; set; }
        public string SMTPServerAddress { get; set; }
        public int SMTPServerPort { get; set; }
        public bool SMTPServerEnableSSL { get; set; }
    }

}
