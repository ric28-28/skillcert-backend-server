import { IsNotEmpty, IsString, IsInt, Max, Min, IsOptional } from "class-validator"

export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    content?: string

    @IsNotEmpty()
    @IsInt()
    @Max(5)
    @Min(1)
    rating: number
}
