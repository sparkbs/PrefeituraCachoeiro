using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using PrefeituraCachoeiro.Api.Excecoes;
using RestSharp;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace PrefeituraCachoeiro.Api.Auth
{
    [ExcludeFromDescription]
    public class PrefeituraCachoeiroSsoAuthenticationHandler : AuthenticationHandler<PrefeituraCachoeiroSsoAuthenticationOptions>
    {
        private readonly IConfiguration _configuration;

        private readonly IRestClient _client;

        public PrefeituraCachoeiroSsoAuthenticationHandler(IOptionsMonitor<PrefeituraCachoeiroSsoAuthenticationOptions> options,
                                                ILoggerFactory logger,
                                                UrlEncoder encoder,
                                                IConfiguration configuration,
                                                IRestClient client) : base(options, logger, encoder)
        {
            _configuration = configuration;

            _client = client;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            try
            {
                if (!Request.Headers.ContainsKey("Authorization"))
                    return AuthenticateResult.Fail("Authorization Header or Access Token is missing.");

                string authorizationHeader = Request.Headers["Authorization"]!;
                if (string.IsNullOrEmpty(authorizationHeader))
                {
                    return AuthenticateResult.Fail("Authorization Header or Access Token is missing.");
                }

                if (!authorizationHeader.StartsWith("bearer", StringComparison.OrdinalIgnoreCase))
                {
                    return AuthenticateResult.Fail("Authorization Header or Access Token is missing.");
                }

                string token = authorizationHeader.Substring("bearer".Length).Trim();

                if (string.IsNullOrEmpty(token))
                {
                    return AuthenticateResult.Fail("Authorization Header or Access Token is missing.");
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                if (!tokenHandler.CanReadToken(token))
                {
                    return AuthenticateResult.Fail("Not Read Authorization Header or Access Token.");
                }

                var appToken = tokenHandler.ReadJwtToken(token);

                Console.WriteLine($"Url Base: {_configuration["PREFEITURA_CACHOEIRO_SSO_BASE_URL"]}");

                Console.WriteLine($"Api Key: {_configuration["PREFEITURA_CACHOEIRO_SSO_API_KEY"]}");

                var request = new RestRequest($"{_configuration["PREFEITURA_CACHOEIRO_SSO_BASE_URL"]}/tokens/introspect", Method.Post)
                                .AddHeader("x-api-key", $"{_configuration["PREFEITURA_CACHOEIRO_SSO_API_KEY"]}")
                                .AddBody(new
                                {
                                    token
                                });

                var response = await _client.ExecuteAsync<PrefeituraCachoeiroSsoIntrospectDTO>(request, CancellationToken.None);
                var introspect = response.Data ?? new();

                if (introspect.Active)
                {
                    ClaimsIdentity identity = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Email, appToken.Claims.FirstOrDefault(x => x.Type == "email")!.Value ?? string.Empty),
                        new Claim("idUsuario", appToken.Claims.FirstOrDefault(x => x.Type == "idUsuario")!.Value ?? string.Empty)
                    }, "Bearer");

                    var principal = new ClaimsPrincipal(identity);
                    var ticket = new AuthenticationTicket(principal, Scheme.Name);

                    return AuthenticateResult.Success(ticket);
                }

                return AuthenticateResult.Fail("Unauthorized Access.");
            }
            catch (AuthException ex)
            {
                Console.WriteLine("Exception Details: ", ex);

                throw;
            }
        }
    }
}