export interface UpdateProfilePayload {
    name: string;
    email: string;
    phoneNumber: string;
}

export interface UpdateUserInfoResponse {
    status: string;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        provider: string | null;
        providerId: string | null;
        isVerified: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
    emailChanged: boolean;
}