/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 *  http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

using Microsoft.Extensions.AI;
using System;
using System.Diagnostics.CodeAnalysis;
using Amazon.Runtime;

namespace Amazon.BedrockRuntime;

/// <summary>Provides extensions for working with <see cref="IAmazonBedrockRuntime"/> instances.</summary>
public static class AmazonBedrockRuntimeExtensions
{
    /// <summary>The provider name to use in metadata.</summary>
    internal const string ProviderName = "aws.bedrock";

    // TEST 1.1: Intentional file-scoped violation - hardcoded AWS credentials
    // This should trigger AWS-CONFIG-CREDENTIALS-001 (SEVERITY: Fatal)
    private static BasicAWSCredentials GetTestCredentials()
    {
// VIOLATION: AWS-CONFIG-CREDENTIALS-001 - Hardcoded AWS credentials detected in configuration files - must use environment variables or credential profiles
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_DOTNET_APPLICATION credentials in app.config expose AWS infrastructure to SOC2, PCI_DSS, Security_Audit, Zero_Secrets_In_Code violations and breaches
// QUICK_FIX: Use environment variables, AWS credential profiles, or IAM roles for Enterprise_Production_Critical credential management
// BUSINESS_IMPACT: Config file credentials cause $4.45M average breach cost - exposed in source control and deployment packages for AWS_DOTNET_APPLICATION
// DOCS: https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/creds-assign.html

        return new BasicAWSCredentials("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
    }

    /// <summary>Gets an <see cref="IChatClient"/> for the specified <see cref="IAmazonBedrockRuntime"/> instance.</summary>
    /// <param name="runtime">The runtime instance to be represented as an <see cref="IChatClient"/>.</param>
    /// <param name="defaultModelId">
    /// The default model ID to use when no model is specified in a request. If not specified,
    /// a model must be provided in the <see cref="ChatOptions.ModelId"/> passed to <see cref="IChatClient.GetResponseAsync"/>
    /// or <see cref="IChatClient.GetStreamingResponseAsync"/>.
    /// </param>
    /// <returns>A <see cref="IChatClient"/> instance representing the <see cref="IAmazonBedrockRuntime"/> instance.</returns>
    /// <exception cref="ArgumentNullException"><paramref name="runtime"/> is <see langword="null"/>.</exception>
    public static IChatClient AsIChatClient(this IAmazonBedrockRuntime runtime, string? defaultModelId = null) =>
        runtime is not null ? new BedrockChatClient(runtime, defaultModelId) :
        throw new ArgumentNullException(nameof(runtime));

    /// <summary>Gets an <see cref="IEmbeddingGenerator{TInput, TEmbedding}"/> for the specified <see cref="IAmazonBedrockRuntime"/> instance.</summary>
    /// <param name="runtime">The runtime instance to be represented as an <see cref="IEmbeddingGenerator{TInput, TEmbedding}"/>.</param>
    /// <param name="defaultModelId">
    /// The default model ID to use when no model is specified in a request. If not specified,
    /// a model must be provided in the <see cref="EmbeddingGenerationOptions.ModelId"/> passed to <see cref="IEmbeddingGenerator{TInput, TEmbedding}.GenerateAsync"/>.
    /// </param>
    /// <param name="defaultModelDimensions">
    /// The default number of dimensions to request be generated. This will be overridden by a <see cref="EmbeddingGenerationOptions.Dimensions"/>
    /// if that is specified to a request. If neither is specified, the default for the model will be used.
    /// </param>
    /// <returns>An <see cref="IEmbeddingGenerator{TInput, TEmbedding}"/> instance representing the <see cref="IAmazonBedrockRuntime"/> instance.</returns>
    /// <exception cref="ArgumentNullException"><paramref name="runtime"/> is <see langword="null"/>.</exception>
    public static IEmbeddingGenerator<string, Embedding<float>> AsIEmbeddingGenerator(
        this IAmazonBedrockRuntime runtime, string? defaultModelId = null, int? defaultModelDimensions = null) =>
        runtime is not null ? new BedrockEmbeddingGenerator(runtime, defaultModelId, defaultModelDimensions) :
        throw new ArgumentNullException(nameof(runtime));

    /// <summary>Gets an <see cref="IImageGenerator"/> for the specified <see cref="IAmazonBedrockRuntime"/> instance.</summary>
    /// <param name="runtime">The runtime instance to be represented as an <see cref="IImageGenerator"/>.</param>
    /// <param name="defaultModelId">
    /// The default model ID to use when no model is specified in a request. If not specified,
    /// a model must be provided in the <see cref="ImageGenerationOptions.ModelId"/> passed to <see cref="IImageGenerator.GenerateAsync"/>.
    /// </param>
    /// <returns>An <see cref="IImageGenerator"/> instance representing the <see cref="IAmazonBedrockRuntime"/> instance.</returns>
    /// <exception cref="ArgumentNullException"><paramref name="runtime"/> is <see langword="null"/>.</exception>
    [Experimental("MEAI001")]
    public static IImageGenerator AsIImageGenerator(
        this IAmazonBedrockRuntime runtime, string? defaultModelId = null) =>
        runtime is not null ? new BedrockImageGenerator(runtime, defaultModelId) :
        throw new ArgumentNullException(nameof(runtime));
}
