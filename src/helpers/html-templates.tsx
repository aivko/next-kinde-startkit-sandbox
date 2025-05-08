const APP_URL = 'https://cheerful-sorbet-b08adf.netlify.app/dashboard/account'

const agencyRegisterTemplate = ({ data }) => `
  <div style="max-width: 600px; width: 100%; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border: 1px solid #ddd;">
    <div style="background: #7700C4; color: white; text-align: center; padding: 15px; font-size: 20px; border-radius: 8px;">
      🎉 Congratulazioni!
    </div>
    <div style="padding: 20px; font-size: 16px; color: #333;">
      <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
        Congratulazioni, l'agenzia <strong>${data.companyName}</strong> si è appena registrata!
      </p>
      <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
        <strong>Nome e cognome responsabile:</strong> ${data.firstName}
      </p>
      <table align="center" style="border-collapse: collapse; border-spacing: 0; margin: auto; max-width: 620px; width: 100%;">
        <tr>
          <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
            <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                <strong>Numero tel:</strong> 
                <a href="tel:${data.phoneNumber}" style="color: #7700C4;">${data.phoneNumber}</a>
            </p>
          </td>
          <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
            <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                <strong>Mail:</strong> 
                <a href="mailto:${data.adminEmail}" style="color: #7700C4;">${data.adminEmail}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
    <div style="text-align: center; font-size: 14px; color: #777; padding-top: 15px; border-top: 1px solid #ddd;">
        <strong><a href="${APP_URL}" style="color: #7700C4;">Area riservata</a></strong> 
    </div>
  </div>`;

const clientRegisterTemplate = ({ data, agency }) => `
  <div style="max-width: 600px; width: 100%; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border: 1px solid #ddd;">
    <div style="background: #7700C4; color: white; text-align: center; padding: 15px; font-size: 20px; border-radius: 8px;">🎉 Congratulazioni!</div>
    <div style="padding: 20px; font-size: 16px; color: #333;">
      <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em; margin: 0;">
        Agency <strong>${agency.companyName}</strong> ha inserito un nuovo cliente <strong>${data.companyName}</strong>!
      </p>
      <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
       ha inserito un nuovo cliente: <strong>${data.firstName}</strong>
      </p>
      <table align="center" style="border-collapse: collapse; border-spacing: 0; margin: auto; max-width: 620px; width: 100%;">
        <tr>
          <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
            <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                <strong>Numero tel:</strong> 
                <a href="tel:${data.phoneNumber}" style="color: #7700C4;">${data.phoneNumber}</a>
            </p>
          </td>
          <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
            <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                <strong>Mail:</strong> 
                <a href="mailto:${data.email}" style="color: #7700C4;">${data.email}</a>
            </p>
          </td>
        </tr>
      </table>
    
      <div style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
        <p><strong>Rechiesta:</strong></p> 
        <table align="center" style="border-collapse: collapse; border-spacing: 0; margin: auto; max-width: 620px; width: 100%;">
            <tr>
              <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
                <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                    Luce:  ${data.electricitySelected ? '&#9989;' : '&#10060;'}
                </p>
              </td>
              <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
                <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                    Gas:   ${data.gasSelected ? '&#9989;' : '&#10060;'}
                </p>
              </td>
              <td style="background-color: #f5f5f5; border-collapse: collapse; border-spacing: 0; padding: 0 6px;">
                  <p style="color: #555; font-size: 16px; font-weight: 400; line-height: 1.44em;">
                    Fibra: ${data.fibreSelected ? '&#9989;' : '&#10060;'}
                  </p>    
              </td>
            </tr>
        </table>
      </div>
    </div>
    <div style="text-align: center; font-size: 14px; color: #777; padding-top: 15px; border-top: 1px solid #ddd;">
        <strong><a href="${APP_URL}" style="color: #7700C4;">Area riservata</a></strong> 
    </div>
  </div>`;

export const htmlTemplates = ({ data, type, agency }) => {
    if (type === 'agency') {
        return agencyRegisterTemplate({ data });
    } else if (type === 'client') {
        return clientRegisterTemplate({ data, agency })
    }
};
