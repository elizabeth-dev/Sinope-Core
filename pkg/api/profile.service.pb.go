// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.0
// 	protoc        v3.19.4
// source: profile.service.proto

package api

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	reflect "reflect"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

var File_profile_service_proto protoreflect.FileDescriptor

var file_profile_service_proto_rawDesc = []byte{
	0x0a, 0x15, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x2e, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x1e, 0x61, 0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e,
	0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e,
	0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x1a, 0x13, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65,
	0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1b, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x65, 0x6d,
	0x70, 0x74, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x32, 0xa3, 0x03, 0x0a, 0x0e, 0x50, 0x72,
	0x6f, 0x66, 0x69, 0x6c, 0x65, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x62, 0x0a, 0x0a,
	0x47, 0x65, 0x74, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x2b, 0x2e, 0x61, 0x70, 0x70,
	0x2e, 0x73, 0x69, 0x6e, 0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69,
	0x2e, 0x76, 0x31, 0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x47, 0x65, 0x74, 0x50, 0x72, 0x6f,
	0x66, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x1a, 0x25, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x73, 0x69,
	0x6e, 0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31,
	0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x22, 0x00,
	0x12, 0x59, 0x0a, 0x0d, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c,
	0x65, 0x12, 0x2e, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e, 0x6f, 0x70, 0x65, 0x2e, 0x67,
	0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c,
	0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x65,
	0x71, 0x1a, 0x16, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x62, 0x75, 0x66, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x22, 0x00, 0x12, 0x68, 0x0a, 0x0d, 0x55,
	0x70, 0x64, 0x61, 0x74, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x2e, 0x2e, 0x61,
	0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e, 0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61,
	0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x55, 0x70, 0x64, 0x61,
	0x74, 0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x1a, 0x25, 0x2e, 0x61,
	0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e, 0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61,
	0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x50, 0x72, 0x6f, 0x66,
	0x69, 0x6c, 0x65, 0x22, 0x00, 0x12, 0x68, 0x0a, 0x0d, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x50,
	0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x2e, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e,
	0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e,
	0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x50, 0x72, 0x6f, 0x66,
	0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x1a, 0x25, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x73, 0x69, 0x6e,
	0x6f, 0x70, 0x65, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x5f, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e,
	0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x22, 0x00, 0x42,
	0x2e, 0x5a, 0x2c, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x65, 0x6c,
	0x69, 0x7a, 0x61, 0x62, 0x65, 0x74, 0x68, 0x2d, 0x64, 0x65, 0x76, 0x2f, 0x53, 0x69, 0x6e, 0x6f,
	0x70, 0x65, 0x2d, 0x43, 0x6f, 0x72, 0x65, 0x2f, 0x70, 0x6b, 0x67, 0x2f, 0x61, 0x70, 0x69, 0x62,
	0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var file_profile_service_proto_goTypes = []interface{}{
	(*GetProfileReq)(nil),    // 0: app.sinope.grpc_api.v1.model.GetProfileReq
	(*DeleteProfileReq)(nil), // 1: app.sinope.grpc_api.v1.model.DeleteProfileReq
	(*UpdateProfileReq)(nil), // 2: app.sinope.grpc_api.v1.model.UpdateProfileReq
	(*CreateProfileReq)(nil), // 3: app.sinope.grpc_api.v1.model.CreateProfileReq
	(*Profile)(nil),          // 4: app.sinope.grpc_api.v1.model.Profile
	(*emptypb.Empty)(nil),    // 5: google.protobuf.Empty
}
var file_profile_service_proto_depIdxs = []int32{
	0, // 0: app.sinope.grpc_api.v1.service.ProfileService.GetProfile:input_type -> app.sinope.grpc_api.v1.model.GetProfileReq
	1, // 1: app.sinope.grpc_api.v1.service.ProfileService.DeleteProfile:input_type -> app.sinope.grpc_api.v1.model.DeleteProfileReq
	2, // 2: app.sinope.grpc_api.v1.service.ProfileService.UpdateProfile:input_type -> app.sinope.grpc_api.v1.model.UpdateProfileReq
	3, // 3: app.sinope.grpc_api.v1.service.ProfileService.CreateProfile:input_type -> app.sinope.grpc_api.v1.model.CreateProfileReq
	4, // 4: app.sinope.grpc_api.v1.service.ProfileService.GetProfile:output_type -> app.sinope.grpc_api.v1.model.Profile
	5, // 5: app.sinope.grpc_api.v1.service.ProfileService.DeleteProfile:output_type -> google.protobuf.Empty
	4, // 6: app.sinope.grpc_api.v1.service.ProfileService.UpdateProfile:output_type -> app.sinope.grpc_api.v1.model.Profile
	4, // 7: app.sinope.grpc_api.v1.service.ProfileService.CreateProfile:output_type -> app.sinope.grpc_api.v1.model.Profile
	4, // [4:8] is the sub-list for method output_type
	0, // [0:4] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_profile_service_proto_init() }
func file_profile_service_proto_init() {
	if File_profile_service_proto != nil {
		return
	}
	file_profile_model_proto_init()
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_profile_service_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   0,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_profile_service_proto_goTypes,
		DependencyIndexes: file_profile_service_proto_depIdxs,
	}.Build()
	File_profile_service_proto = out.File
	file_profile_service_proto_rawDesc = nil
	file_profile_service_proto_goTypes = nil
	file_profile_service_proto_depIdxs = nil
}
