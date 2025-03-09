using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using PrefeituraCachoeiro.Api.Configurations;
using PrefeituraCachoeiro.Aplicacao.Middlewares;
using PrefeituraCachoeiro.Environment;
using PrefeituraCachoeiro.Ioc;
using System.Text;

namespace PrefeituraCachoeiro.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigins", builder => builder
                                      .WithOrigins("*")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });

            services.AddControllers();
            services.AddServices(Configuration);
            services.AddControllers(options =>
            {
                options.Filters.Add<ApplicationUserFilter>();
            });

            services.AddSwaggerConfiguration();
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });

            var appSettings = Configuration.GetSection("configuracoes").Get<AppSettings>();
            services.AddSingleton(appSettings);

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = appSettings.TokenConfiguration.Issuer,
                    ValidAudience = appSettings.TokenConfiguration.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.TokenConfiguration.Secret))
                };
            });

            services.AddAuthorization(auth =>
            {
                auth.AddPolicy(JwtBearerDefaults.AuthenticationScheme, new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser().Build());
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.DocumentTitle = "Prefeitura de Cachoeiro - Gestor de Medições de Projetos";
                });
            //}

            app.UseCors("AllowSpecificOrigins");
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseMiddleware(typeof(CustomSecurityHeader));
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}