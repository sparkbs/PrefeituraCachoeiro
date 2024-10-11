namespace PrefeituraCachoeiro.Api.Auth
{
    public class PrefeituraCachoeiroSsoIntrospectDTO
    {
        public PrefeituraCachoeiroSsoIntrospectDTO()
        {
            Active = false;
        }

        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; } = false;
    }
}