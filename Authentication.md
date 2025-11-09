## Authentication, Authorization, OIDC, and OAuth2 Interview Q\&A for Senior .NET Developers

---

### 1. What is the difference between Authentication and Authorization?

* **Authentication**: Verifies who the user is.
* **Authorization**: Determines what the user is allowed to do.

**Example**:

* Login with credentials = Authentication
* Access control (e.g., Admin page) = Authorization

---

### 2. How do you implement JWT-based authentication in .NET Core?

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "your_issuer",
            ValidateAudience = true,
            ValidAudience = "your_audience",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("your_secret_key"))
        };
    });
```

Use `[Authorize]` on controllers/actions to protect endpoints.

---

### 3. What is OAuth2 and how does it differ from OpenID Connect (OIDC)?

* **OAuth2**: Authorization framework (access to resources).
* **OIDC**: Authentication layer built on top of OAuth2.

**Example**:

* OAuth2: "App wants access to your Google Drive"
* OIDC: "Login with Google"

---

### 4. What are the common OAuth2 flows and their use cases?

* **Authorization Code Flow**: Secure web applications (with backend)
* **Client Credentials**: Machine-to-machine communication
* **Implicit Flow**: Legacy SPAs (not recommended anymore)
* **PKCE (Proof Key for Code Exchange)**: Secure for public clients (SPAs, mobile apps)

---

### 5. How to secure a .NET Web API using OAuth2?

1. Use IdentityServer, Auth0, Azure AD, etc.
2. Accept and validate Bearer tokens.
3. Configure authentication middleware.
4. Use `[Authorize]` attributes.
5. Implement role/claims-based authorization.

---

### 6. How do you implement role-based and policy-based authorization?

```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});

[Authorize(Policy = "AdminOnly")]
public IActionResult AdminDashboard() => View();
```

---

### 7. How do you handle token expiration and renewal?

* Tokens include an expiration (`exp`) claim, which defines the UTC time when the token expires.
* Once the token expires, the user will no longer be able to access protected resources.
* **Refresh tokens** are long-lived tokens used to obtain new access tokens without re-authenticating the user.
* Typically, your app checks the token expiry time and uses the refresh token before expiration to get a new access token.

---

### 8. What is inside a JWT token?

A JWT consists of **three parts**:

1. **Header**: Specifies the signing algorithm and token type.
2. **Payload**: Contains claims like `sub`, `name`, `iat`, `exp`, etc.
3. **Signature**: Validates the token wasn't tampered with.

Example payload:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

---

### 9. Benefits of using IdentityServer4 in .NET Core?

* Implements OAuth2 and OIDC standards
* Centralized authentication server
* Supports SSO, multi-tenancy, federation
* Highly configurable and extendable

---

### 10. What is PKCE and why is it used?

**PKCE (Proof Key for Code Exchange)** improves security for public clients (e.g., SPAs) using Authorization Code Flow.

* Prevents interception of authorization code
* Uses code verifier/challenge mechanism

---

### 11. How to manually validate JWT tokens in .NET?

```csharp
var handler = new JwtSecurityTokenHandler();
var token = handler.ReadJwtToken(jwt);
var claims = token.Claims;
```

.NET Core usually handles validation automatically via `TokenValidationParameters`.


### Common OAuth2 Flows with Illustrations

**Authorization Code Flow(with PKCE for public clients)**
- Use cases: Web apps, SPAs, and mobile apps
- Security: Most secure, uses server-side code + code verifier

**Flow**
- User visits app -> redirects to authorization server
- User logs in -> Auth server redirects back with **auth code**(auth code temp code expires in about 5 mins, single use)
- App sends auth code + PKCE code verifier to token endpoint
- Server validates + sends back access token + refresh token

+--------+     +---------------+     +--------------+
|        | --> | Authorization | --> |              |
|  User  |     |     Server    |     |    App       |
|        | <-- | (Login Page)  | <-- |              |
+--------+     +---------------+     +--------------+
                          |
                    (Auth Code)
                          |
                          v
                 +-------------------+
                 | Token Endpoint    |
                 | (Exchange Code)   |
                 +-------------------+
                          |
                          v
                 Access Token + Refresh Token


### Client Credentials Flow

- Use case: Service to Service APIs(no user)

**Flow**
- Backend sends client ID + secret to token endpoint
- Gets back an **access token**
- Uses token to call secured APIs

+--------------+      +-------------------+
|   Backend    | ---> | Token Endpoint    |
|  (Service)   |      |  (OAuth Server)   |
+--------------+      +-------------------+
                           |
                           v
                    Access Token

### Implicit Flow(Legacy, not recommended)

- Use case: legacy browser based SPAs
- Risk: Token expposed in URL, no refresh token

### Device Code Flow
- Use Case: Devices with limited input(TVs, CLI)

**Flow**
- device requests device code
- user visits verification URL on phone/laptop
- Enters code and logs in
- Device polls for access token

+---------+             +------------------+
|  Device | ---(code)--> Authorization Srv |
+---------+             +------------------+
         \                   ^
          \                 /
           \               /
            v             v
        User uses phone to log in


### Refresh Token Flow

- Use cases: To avoid re-authenticating user repeteadly
- Used with: Auth code + PKCE, or Mobile apps

**Flow**
- app stores refresh token
- when access token expires, send refresh token
- get new access token