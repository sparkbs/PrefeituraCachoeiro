export class AuthResponse {
    Login: string = '';
    IsSucesso: boolean = false;
    accessToken: AccessTokenResponse;
}


export class AccessTokenResponse
{
    Authenticated: boolean = false;
    Created: string = '';
    expiration: string = '';
    accessToken: string = '';
    RefreshToken: string = '';
    idUsuario: number = 0;
    nome : string = '';
    Login : string = '';
}