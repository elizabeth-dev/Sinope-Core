// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.1
// source: profile.service.proto

package api

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ProfileServiceClient is the client API for ProfileService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ProfileServiceClient interface {
	GetProfile(ctx context.Context, in *GetProfileReq, opts ...grpc.CallOption) (*Profile, error)
	DeleteProfile(ctx context.Context, in *DeleteProfileReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	UpdateProfile(ctx context.Context, in *UpdateProfileReq, opts ...grpc.CallOption) (*Profile, error)
	CreateProfile(ctx context.Context, in *CreateProfileReq, opts ...grpc.CallOption) (*Profile, error)
}

type profileServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewProfileServiceClient(cc grpc.ClientConnInterface) ProfileServiceClient {
	return &profileServiceClient{cc}
}

func (c *profileServiceClient) GetProfile(ctx context.Context, in *GetProfileReq, opts ...grpc.CallOption) (*Profile, error) {
	out := new(Profile)
	err := c.cc.Invoke(ctx, "/app.sinope.grpc_api.v1.service.ProfileService/GetProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *profileServiceClient) DeleteProfile(ctx context.Context, in *DeleteProfileReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/app.sinope.grpc_api.v1.service.ProfileService/DeleteProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *profileServiceClient) UpdateProfile(ctx context.Context, in *UpdateProfileReq, opts ...grpc.CallOption) (*Profile, error) {
	out := new(Profile)
	err := c.cc.Invoke(ctx, "/app.sinope.grpc_api.v1.service.ProfileService/UpdateProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *profileServiceClient) CreateProfile(ctx context.Context, in *CreateProfileReq, opts ...grpc.CallOption) (*Profile, error) {
	out := new(Profile)
	err := c.cc.Invoke(ctx, "/app.sinope.grpc_api.v1.service.ProfileService/CreateProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ProfileServiceServer is the server API for ProfileService service.
// All implementations must embed UnimplementedProfileServiceServer
// for forward compatibility
type ProfileServiceServer interface {
	GetProfile(context.Context, *GetProfileReq) (*Profile, error)
	DeleteProfile(context.Context, *DeleteProfileReq) (*emptypb.Empty, error)
	UpdateProfile(context.Context, *UpdateProfileReq) (*Profile, error)
	CreateProfile(context.Context, *CreateProfileReq) (*Profile, error)
	mustEmbedUnimplementedProfileServiceServer()
}

// UnimplementedProfileServiceServer must be embedded to have forward compatible implementations.
type UnimplementedProfileServiceServer struct {
}

func (UnimplementedProfileServiceServer) GetProfile(context.Context, *GetProfileReq) (*Profile, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetProfile not implemented")
}
func (UnimplementedProfileServiceServer) DeleteProfile(context.Context, *DeleteProfileReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteProfile not implemented")
}
func (UnimplementedProfileServiceServer) UpdateProfile(context.Context, *UpdateProfileReq) (*Profile, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateProfile not implemented")
}
func (UnimplementedProfileServiceServer) CreateProfile(context.Context, *CreateProfileReq) (*Profile, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateProfile not implemented")
}
func (UnimplementedProfileServiceServer) mustEmbedUnimplementedProfileServiceServer() {}

// UnsafeProfileServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ProfileServiceServer will
// result in compilation errors.
type UnsafeProfileServiceServer interface {
	mustEmbedUnimplementedProfileServiceServer()
}

func RegisterProfileServiceServer(s grpc.ServiceRegistrar, srv ProfileServiceServer) {
	s.RegisterService(&ProfileService_ServiceDesc, srv)
}

func _ProfileService_GetProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetProfileReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProfileServiceServer).GetProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/app.sinope.grpc_api.v1.service.ProfileService/GetProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProfileServiceServer).GetProfile(ctx, req.(*GetProfileReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProfileService_DeleteProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteProfileReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProfileServiceServer).DeleteProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/app.sinope.grpc_api.v1.service.ProfileService/DeleteProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProfileServiceServer).DeleteProfile(ctx, req.(*DeleteProfileReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProfileService_UpdateProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateProfileReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProfileServiceServer).UpdateProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/app.sinope.grpc_api.v1.service.ProfileService/UpdateProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProfileServiceServer).UpdateProfile(ctx, req.(*UpdateProfileReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProfileService_CreateProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateProfileReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProfileServiceServer).CreateProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/app.sinope.grpc_api.v1.service.ProfileService/CreateProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProfileServiceServer).CreateProfile(ctx, req.(*CreateProfileReq))
	}
	return interceptor(ctx, in, info, handler)
}

// ProfileService_ServiceDesc is the grpc.ServiceDesc for ProfileService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ProfileService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "app.sinope.grpc_api.v1.service.ProfileService",
	HandlerType: (*ProfileServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetProfile",
			Handler:    _ProfileService_GetProfile_Handler,
		},
		{
			MethodName: "DeleteProfile",
			Handler:    _ProfileService_DeleteProfile_Handler,
		},
		{
			MethodName: "UpdateProfile",
			Handler:    _ProfileService_UpdateProfile_Handler,
		},
		{
			MethodName: "CreateProfile",
			Handler:    _ProfileService_CreateProfile_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "profile.service.proto",
}
