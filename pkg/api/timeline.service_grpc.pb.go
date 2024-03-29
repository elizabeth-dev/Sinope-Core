// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.1
// source: timeline.service.proto

package api

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// TimelineServiceClient is the client API for TimelineService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type TimelineServiceClient interface {
	GetTimeline(ctx context.Context, in *GetTimelineReq, opts ...grpc.CallOption) (TimelineService_GetTimelineClient, error)
}

type timelineServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewTimelineServiceClient(cc grpc.ClientConnInterface) TimelineServiceClient {
	return &timelineServiceClient{cc}
}

func (c *timelineServiceClient) GetTimeline(ctx context.Context, in *GetTimelineReq, opts ...grpc.CallOption) (TimelineService_GetTimelineClient, error) {
	stream, err := c.cc.NewStream(ctx, &TimelineService_ServiceDesc.Streams[0], "/app.sinope.grpc_api.v1.service.TimelineService/GetTimeline", opts...)
	if err != nil {
		return nil, err
	}
	x := &timelineServiceGetTimelineClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type TimelineService_GetTimelineClient interface {
	Recv() (*Post, error)
	grpc.ClientStream
}

type timelineServiceGetTimelineClient struct {
	grpc.ClientStream
}

func (x *timelineServiceGetTimelineClient) Recv() (*Post, error) {
	m := new(Post)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// TimelineServiceServer is the server API for TimelineService service.
// All implementations must embed UnimplementedTimelineServiceServer
// for forward compatibility
type TimelineServiceServer interface {
	GetTimeline(*GetTimelineReq, TimelineService_GetTimelineServer) error
	mustEmbedUnimplementedTimelineServiceServer()
}

// UnimplementedTimelineServiceServer must be embedded to have forward compatible implementations.
type UnimplementedTimelineServiceServer struct {
}

func (UnimplementedTimelineServiceServer) GetTimeline(*GetTimelineReq, TimelineService_GetTimelineServer) error {
	return status.Errorf(codes.Unimplemented, "method GetTimeline not implemented")
}
func (UnimplementedTimelineServiceServer) mustEmbedUnimplementedTimelineServiceServer() {}

// UnsafeTimelineServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to TimelineServiceServer will
// result in compilation errors.
type UnsafeTimelineServiceServer interface {
	mustEmbedUnimplementedTimelineServiceServer()
}

func RegisterTimelineServiceServer(s grpc.ServiceRegistrar, srv TimelineServiceServer) {
	s.RegisterService(&TimelineService_ServiceDesc, srv)
}

func _TimelineService_GetTimeline_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(GetTimelineReq)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(TimelineServiceServer).GetTimeline(m, &timelineServiceGetTimelineServer{stream})
}

type TimelineService_GetTimelineServer interface {
	Send(*Post) error
	grpc.ServerStream
}

type timelineServiceGetTimelineServer struct {
	grpc.ServerStream
}

func (x *timelineServiceGetTimelineServer) Send(m *Post) error {
	return x.ServerStream.SendMsg(m)
}

// TimelineService_ServiceDesc is the grpc.ServiceDesc for TimelineService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var TimelineService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "app.sinope.grpc_api.v1.service.TimelineService",
	HandlerType: (*TimelineServiceServer)(nil),
	Methods:     []grpc.MethodDesc{},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "GetTimeline",
			Handler:       _TimelineService_GetTimeline_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "timeline.service.proto",
}
