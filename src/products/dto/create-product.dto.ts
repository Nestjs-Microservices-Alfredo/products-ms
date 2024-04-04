import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";


export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    @Type(() => String )
    public name: string;

    @IsNotEmpty()
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @Min(0)
    @Type(() => Number)
    public price: number;

}
