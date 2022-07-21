using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using SalesAndDistributionSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Common
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
             _configuration = configuration;
        }

        public string BodyReader(EmailConfiguration emailConfiguration, string Path)
        {
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(Path))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{Title}", emailConfiguration.Title);

            body = body.Replace("{UserName}", emailConfiguration.ToEmail);
            body = body.Replace("{Password}", emailConfiguration.EmailBody_Password);
            body = body.Replace("{PageLink}", emailConfiguration.EmailBody_PageLink);
            body = body.Replace("{PageBody}", emailConfiguration.EmailBody);
            return body;
        }

        public async Task SendEmailAsync(EmailConfiguration mailRequest)
        {
            mailRequest.From = "verify.squareinformatix@gmail.com";
            mailRequest.Host = "smtp.gmail.com";
            mailRequest.Port = 587;
            mailRequest.Password = "nmdyzfgpbhslagmm";
            mailRequest.UserName = "verify.squareinformatix@gmail.com";

            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(mailRequest.From);
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;
            var builder = new BodyBuilder();
            if (mailRequest.Attachments != null)
            {
                byte[] fileBytes;
                foreach (var file in mailRequest.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                    }
                }
            }
            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(mailRequest.Host, mailRequest.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(mailRequest.From, mailRequest.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
    }
}
